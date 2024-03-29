import { BigNumber } from 'bignumber.js';
import { inject, injectable } from 'inversify';
import { BillAccess } from 'src/access/BillAccess';
import { BillShareAccess } from 'src/access/BillShareAccess';
import { BookAccess } from 'src/access/BookAccess';
import { DbAccess } from 'src/access/DbAccess';
import { DeviceBookAccess } from 'src/access/DeviceBookAccess';
import { MemberAccess } from 'src/access/MemberAccess';
import { TransferAccess } from 'src/access/TransferAccess';
import { ViewBillShareAccess } from 'src/access/ViewBillShareAccess';
import { ViewBookAccess } from 'src/access/ViewBookAccess';
import { ViewDeviceBookAccess } from 'src/access/ViewDeviceBookAccess';
import { ViewTransactionAccess } from 'src/access/ViewTransactionAccess';
import { BillType } from 'src/constant/Book';
import {
  DeleteBookBillResponse,
  DeleteBookTransferResponse,
  GetBookIdParams,
  GetBookIdResponse,
  GetBookResponse,
  PostBookBillRequest,
  PostBookBillResponse,
  PostBookIdResponse,
  PostBookMemberRequest,
  PostBookMemberResponse,
  PostBookRequest,
  PostBookResponse,
  PostBookTransferRequest,
  PostBookTransferResponse,
  PutBookBillRequest,
  PutBookBillResponse,
  PutBookMemberRequest,
  PutBookMemberResponse,
  PutBookRequest,
  PutBookResponse,
  PutBookShowDeleteResponse,
  PutBookTransferResponse,
} from 'src/model/api/Book';
import { Bill } from 'src/model/entity/Bill';
import { BillEntity } from 'src/model/entity/BillEntity';
import { BillShareEntity } from 'src/model/entity/BillShareEntity';
import { BookEntity } from 'src/model/entity/BookEntity';
import { DeviceBookEntity } from 'src/model/entity/DeviceBookEntity';
import { Member } from 'src/model/entity/Member';
import { MemberEntity } from 'src/model/entity/MemberEntity';
import { Transfer } from 'src/model/entity/Transfer';
import { TransferEntity } from 'src/model/entity/TransferEntity';
import { BadRequestError } from 'src/model/error';
import { Pagination, PaginationParams } from 'src/model/Pagination';
import {
  BookDetail,
  History,
  ShareDetail,
  TransactionBill,
  TransactionTransfer,
} from 'src/model/type/Book';
import { ViewBillShare } from 'src/model/viewEntity/ViewBillShare';
import { ViewBook } from 'src/model/viewEntity/ViewBook';
import { bn } from 'src/util/bignumber';
import { compare } from 'src/util/compare';
import { randomBase10 } from 'src/util/random';
import { differenceBy, intersectionBy } from 'src/util/setTheory';

/**
 * Service class for Book
 */
@injectable()
export class BookService {
  @inject(DbAccess)
  private readonly dbAccess!: DbAccess;

  @inject(DeviceBookAccess)
  private readonly deviceBookAccess!: DeviceBookAccess;

  @inject(BookAccess)
  private readonly bookAccess!: BookAccess;

  @inject(MemberAccess)
  private readonly memberAccess!: MemberAccess;

  @inject(BillAccess)
  private readonly billAccess!: BillAccess;

  @inject(BillShareAccess)
  private readonly billShareAccess!: BillShareAccess;

  @inject(TransferAccess)
  private readonly transferAccess!: TransferAccess;

  @inject(ViewBookAccess)
  private readonly vBookAccess!: ViewBookAccess;

  @inject(ViewBillShareAccess)
  private readonly vBillShareAccess!: ViewBillShareAccess;

  @inject(ViewTransactionAccess)
  private readonly vTransactionAccess!: ViewTransactionAccess;

  @inject(ViewDeviceBookAccess)
  private readonly vDeviceBookAccess!: ViewDeviceBookAccess;

  public async cleanup() {
    await this.dbAccess.cleanup();
  }

  public async createBook(
    data: PostBookRequest,
    deviceId: string
  ): Promise<PostBookResponse> {
    const book = new BookEntity();
    book.name = data.bookName;
    book.code = randomBase10(6);
    book.symbol = '$';

    const newBook = await this.bookAccess.save(book);

    const deviceBook = new DeviceBookEntity();
    deviceBook.deviceId = deviceId;
    deviceBook.bookId = newBook.id;
    deviceBook.showDelete = false;

    await this.deviceBookAccess.save(deviceBook);

    if (data.nickname) {
      const member = new MemberEntity();
      member.bookId = newBook.id;
      member.nickname = data.nickname;
      member.deviceId = deviceId;
      member.total = 0;
      member.balance = 0;
      member.deletable = true;

      await this.memberAccess.save(member);
    }

    return newBook;
  }

  private async checkDeviceHasBook(
    deviceId: string,
    bookId: string
  ): Promise<ViewBook> {
    const deviceBook = await this.vDeviceBookAccess.findByDeviceIdAndBookId(
      deviceId,
      bookId
    );

    return {
      id: deviceBook.bookId,
      name: deviceBook.name,
      code: deviceBook.code,
      symbol: deviceBook.symbol,
      dateCreated: deviceBook.dateCreated,
      lastDateUpdated: deviceBook.lastDateUpdated,
    };
  }

  public async getBookList(deviceId: string): Promise<GetBookResponse> {
    const vDeviceBooks = await this.vDeviceBookAccess.findByDeviceId(deviceId);

    return vDeviceBooks.sort(compare('lastDateUpdated', 'desc'));
  }

  private compareTxTransfer = (
    oldTx: TransactionTransfer,
    newTx: Transfer
  ): History => {
    const items: History['items'] = [];
    if (String(oldTx.date) !== String(newTx.date))
      items.push({ key: 'date', from: oldTx.date, to: newTx.date });
    if (oldTx.amount !== newTx.amount)
      items.push({ key: 'amount', from: oldTx.amount, to: newTx.amount });
    if (oldTx.srcMemberId !== newTx.srcMemberId)
      items.push({
        key: 'srcMemberId',
        from: oldTx.srcMemberId,
        to: newTx.srcMemberId,
      });
    if (oldTx.dstMemberId !== newTx.dstMemberId)
      items.push({
        key: 'dstMemberId',
        from: oldTx.dstMemberId,
        to: newTx.dstMemberId,
      });
    if (oldTx.memo !== newTx.memo)
      items.push({ key: 'memo', from: oldTx.memo, to: newTx.memo });

    return { date: oldTx.dateUpdated, items };
  };

  private compareTxBill = (
    oldTx: TransactionBill,
    newTx: TransactionBill
  ): History => {
    const items: History['items'] = [];
    if (String(oldTx.date) !== String(newTx.date))
      items.push({ key: 'date', from: oldTx.date, to: newTx.date });
    if (oldTx.amount !== newTx.amount)
      items.push({ key: 'amount', from: oldTx.amount, to: newTx.amount });
    if (oldTx.descr !== newTx.descr)
      items.push({ key: 'descr', from: oldTx.descr, to: newTx.descr });
    if (oldTx.memo !== newTx.memo)
      items.push({ key: 'memo', from: oldTx.memo, to: newTx.memo });

    const sameFormer = intersectionBy(newTx.former, oldTx.former, 'id');
    for (const former of sameFormer) {
      const old = oldTx.former.find((v) => v.id === former.id);
      if (old?.amount !== former.amount)
        items.push({
          key: 'former',
          from: `${old?.id}:${old?.amount}`,
          to: `${former.id}:${former.amount}`,
        });
    }
    const addFormer = differenceBy(newTx.former, oldTx.former, 'id');
    for (const former of addFormer)
      items.push({
        key: 'former',
        from: null,
        to: `${former.id}:${former.amount}`,
      });

    const minusFormer = differenceBy(oldTx.former, newTx.former, 'id');
    for (const former of minusFormer)
      items.push({
        key: 'former',
        from: `${former.id}:${former.amount}`,
        to: null,
      });

    const sameLatter = intersectionBy(newTx.latter, oldTx.latter, 'id');
    for (const latter of sameLatter) {
      const old = oldTx.latter.find((v) => v.id === latter.id);
      if (old?.amount !== latter.amount)
        items.push({
          key: 'latter',
          from: `${old?.id}:${old?.amount}`,
          to: `${latter.id}:${latter.amount}`,
        });
    }
    const addLatter = differenceBy(newTx.latter, oldTx.latter, 'id');
    for (const latter of addLatter)
      items.push({
        key: 'latter',
        from: null,
        to: `${latter.id}:${latter.amount}`,
      });

    const minusLatter = differenceBy(oldTx.latter, newTx.latter, 'id');
    for (const latter of minusLatter)
      items.push({
        key: 'latter',
        from: `${latter.id}:${latter.amount}`,
        to: null,
      });

    return { date: oldTx.dateUpdated, items };
  };

  private handleTransfer = (transfers: Transfer[]) => {
    const res: TransactionTransfer[] = [];
    for (const tx of transfers) {
      const idx = res.findIndex((v) => v.id === tx.id);
      if (idx < 0)
        res.push({
          id: tx.id,
          ver: tx.ver,
          bookId: tx.bookId,
          date: tx.date,
          type: 'transfer',
          amount: tx.amount,
          srcMemberId: tx.srcMemberId,
          dstMemberId: tx.dstMemberId,
          memo: tx.memo,
          dateCreated: tx.dateCreated,
          dateUpdated: tx.dateUpdated,
          dateDeleted: tx.dateDeleted,
          history: [],
        });
      else {
        const lastTx = res[idx];
        const diff = this.compareTxTransfer(lastTx, tx);
        res[idx] = {
          id: tx.id,
          ver: tx.ver,
          bookId: tx.bookId,
          date: tx.date,
          type: 'transfer',
          amount: tx.amount,
          srcMemberId: tx.srcMemberId,
          dstMemberId: tx.dstMemberId,
          memo: tx.memo,
          dateCreated: lastTx.dateCreated,
          dateUpdated: tx.dateUpdated,
          dateDeleted: tx.dateDeleted,
          history: [diff, ...lastTx.history],
        };
      }
    }

    return res;
  };

  private handleBill = (billShares: ViewBillShare[]) => {
    const bills: TransactionBill[] = [];
    for (const share of billShares) {
      const idx = bills.findIndex(
        (v) => v.id === share.billId && v.ver === share.ver
      );
      const isFormer =
        (share.type === 'out' && share.memberAmount > 0) ||
        (share.type === 'in' && share.memberAmount < 0);
      if (idx < 0)
        bills.push({
          id: share.billId,
          ver: share.ver,
          bookId: share.bookId,
          date: share.date,
          type: share.type,
          descr: share.descr,
          amount: share.amount,
          former: isFormer
            ? [
                {
                  id: share.memberId,
                  method: share.method,
                  value: share.value ?? undefined,
                  amount: share.memberAmount,
                },
              ]
            : [],
          latter: !isFormer
            ? [
                {
                  id: share.memberId,
                  method: share.method,
                  value: share.value ?? undefined,
                  amount: share.memberAmount,
                },
              ]
            : [],
          memo: share.memo,
          dateCreated: share.dateCreated,
          dateUpdated: share.dateUpdated,
          dateDeleted: share.dateDeleted,
          history: [],
        });
      else {
        const lastBill = bills[idx];
        bills[idx] = {
          ...lastBill,
          former: isFormer
            ? [
                {
                  id: share.memberId,
                  method: share.method,
                  value: share.value ?? undefined,
                  amount: share.memberAmount,
                },
                ...lastBill.former,
              ]
            : [...lastBill.former],
          latter: !isFormer
            ? [
                {
                  id: share.memberId,
                  method: share.method,
                  value: share.value ?? undefined,
                  amount: share.memberAmount,
                },
                ...lastBill.latter,
              ]
            : [...lastBill.latter],
        };
      }
    }

    const res: TransactionBill[] = [];
    for (const tx of bills) {
      const idx = res.findIndex((v) => v.id === tx.id);
      if (idx < 0)
        res.push({
          ...tx,
          former: tx.former,
          latter: tx.latter,
        });
      else {
        const lastTx = res[idx];
        const diff = this.compareTxBill(lastTx, tx);
        res[idx] = {
          ...tx,
          dateCreated: lastTx.dateCreated,
          former: tx.former,
          latter: tx.latter,
          history: [diff, ...lastTx.history],
        };
      }
    }

    return res;
  };

  private async getMemberByBook(id: string) {
    const members = await this.memberAccess.findByBookId(id);

    return members.sort(compare('dateCreated'));
  }

  private async getBookDetail(
    book: ViewBook,
    paginate?: PaginationParams | null
  ): Promise<Pagination<BookDetail>> {
    const limit = paginate ? Number(paginate.limit) : 50;
    const offset = paginate ? Number(paginate.offset) : 0;

    const [members, { data: tx, count }] = await Promise.all([
      this.getMemberByBook(book.id),
      this.vTransactionAccess.findAndCountByBookId(book.id, {
        order: { date: 'desc' },
        take: limit,
        skip: offset,
      }),
    ]);

    const [transfers, billShares] = await Promise.all([
      this.transferAccess.findByIds(
        tx.filter((v) => v.type === 'transfer').map((v) => v.id)
      ),
      this.vBillShareAccess.findByBillIds(
        tx.filter((v) => v.type === 'bill').map((v) => v.id)
      ),
    ]);

    return {
      paginate: { count, limit, offset },
      data: {
        ...book,
        members,
        transactions: [
          ...this.handleTransfer(transfers),
          ...this.handleBill(billShares),
        ].sort(compare('date', 'desc')),
      },
    };
  }

  public async getBook(
    id: string,
    deviceId: string,
    params: GetBookIdParams | null
  ): Promise<Pagination<GetBookIdResponse>> {
    const book = await this.vBookAccess.findById(id);

    const oldDeviceBook = await this.deviceBookAccess.findByDeviceIdAndBookId(
      deviceId,
      id
    );
    if (oldDeviceBook === null) {
      const deviceBook = new DeviceBookEntity();
      deviceBook.deviceId = deviceId;
      deviceBook.bookId = book.id;
      deviceBook.showDelete = false;

      await this.deviceBookAccess.save(deviceBook);
    }

    return await this.getBookDetail(book, params);
  }

  public async addDeviceBook(
    id: string,
    deviceId: string
  ): Promise<Pagination<PostBookIdResponse>> {
    const book = await this.vBookAccess.findById(id);

    const deviceBook = new DeviceBookEntity();
    deviceBook.deviceId = deviceId;
    deviceBook.bookId = book.id;
    deviceBook.showDelete = false;

    await this.deviceBookAccess.save(deviceBook);

    return await this.getBookDetail(book);
  }

  public async deleteDeviceBook(id: string, deviceId: string) {
    await this.deviceBookAccess.hardDeleteByDeviceIdAndBookId(deviceId, id);
  }

  public async setDeviceBookShowDelete(
    bookId: string,
    deviceId: string
  ): Promise<PutBookShowDeleteResponse> {
    const oldDeviceBook = await this.vDeviceBookAccess.findByDeviceIdAndBookId(
      deviceId,
      bookId
    );

    const deviceBook = new DeviceBookEntity();
    deviceBook.id = oldDeviceBook.id;
    deviceBook.deviceId = deviceId;
    deviceBook.bookId = bookId;
    deviceBook.showDelete = !oldDeviceBook.showDelete;

    await this.deviceBookAccess.update(deviceBook);

    return { ...oldDeviceBook, showDelete: !oldDeviceBook.showDelete };
  }

  public async reviseBook(
    id: string,
    data: PutBookRequest,
    deviceId: string
  ): Promise<PutBookResponse> {
    const oldBook = await this.checkDeviceHasBook(deviceId, id);

    const book = new BookEntity();
    book.id = id;
    book.name = data.name ?? oldBook.name;
    book.symbol = data.symbol ?? oldBook.symbol;
    book.code = oldBook.code;

    await this.bookAccess.update(book);

    return book;
  }

  public async addMember(
    id: string,
    data: PostBookMemberRequest,
    deviceId: string
  ): Promise<PostBookMemberResponse> {
    await this.checkDeviceHasBook(deviceId, id);

    const member = new MemberEntity();
    member.bookId = id;
    member.nickname = data.nickname;
    member.total = 0;
    member.balance = 0;
    member.deletable = true;

    return await this.memberAccess.save(member);
  }

  public async reviseMemberNickname(
    bid: string,
    mid: string,
    data: PutBookMemberRequest,
    deviceId: string
  ): Promise<PutBookMemberResponse> {
    await this.checkDeviceHasBook(deviceId, bid);

    const oldMember = await this.memberAccess.findById(mid);
    if (oldMember.bookId !== bid) throw new BadRequestError('bad request');

    const newMember: Member = {
      ...oldMember,
      nickname: data.nickname,
    };
    await this.memberAccess.update(newMember);

    return newMember;
  }

  public async deleteMember(bid: string, mid: string, deviceId: string) {
    await this.checkDeviceHasBook(deviceId, bid);
    const member = await this.memberAccess.findById(mid);
    if (member.bookId !== bid) throw new BadRequestError('bad request');
    if (member.deletable === false) throw new BadRequestError('not deletable');

    await this.memberAccess.hardDeleteById(mid);
  }

  public async reviseMemberSelf(
    bid: string,
    mid: string,
    deviceId: string
  ): Promise<PutBookMemberResponse> {
    await this.checkDeviceHasBook(deviceId, bid);

    const oldMember = await this.memberAccess.findById(mid);
    if (oldMember.bookId !== bid) throw new BadRequestError('bad request');

    const newMember: Member = {
      ...oldMember,
      deviceId: oldMember.deviceId === deviceId ? null : deviceId,
    };
    await this.memberAccess.update(newMember);

    return newMember;
  }

  private validateDetail(amount: number, data: ShareDetail[]) {
    if (!BigNumber.sum(...data.map((v) => v.amount)).eq(amount))
      throw new BadRequestError('sum is not consistent');
  }

  private async updateMember(
    id: string,
    amount: number | BigNumber,
    updateTotal = false
  ) {
    const oldMember = await this.memberAccess.findById(id);
    const newMember: Member = {
      ...oldMember,
      total: updateTotal
        ? bn(oldMember.total).plus(amount).toNumber()
        : oldMember.total,
      balance: bn(oldMember.balance).plus(amount).toNumber(),
      deletable: false,
    };
    await this.memberAccess.update(newMember);

    return newMember;
  }

  public async addBill(
    id: string,
    data: PostBookBillRequest,
    deviceId: string
  ): Promise<PostBookBillResponse> {
    await this.checkDeviceHasBook(deviceId, id);

    try {
      await this.dbAccess.startTransaction();

      const bill = new BillEntity();
      bill.ver = '1';
      bill.bookId = id;
      bill.date = data.date;
      bill.type = data.type;
      bill.descr = data.descr;
      bill.amount = data.amount;
      bill.memo = data.memo ?? null;

      const newBill = await this.billAccess.save(bill);
      this.validateDetail(data.amount, data.former);
      this.validateDetail(data.amount, data.latter);

      await Promise.all(
        data.former.map(async (v) => {
          let amount = v.amount;
          if (data.type === BillType.In) amount = v.amount * -1;

          const billShare = new BillShareEntity();
          billShare.billId = newBill.id;
          billShare.ver = '1';
          billShare.memberId = v.id;
          billShare.method = v.method;
          billShare.value = v.value ?? null;
          billShare.amount = amount;

          await this.billShareAccess.save(billShare);

          return await this.updateMember(v.id, amount);
        })
      );
      await Promise.all(
        data.latter.map(async (v) => {
          let amount = v.amount;
          if (data.type === BillType.Out) amount = v.amount * -1;

          const billShare = new BillShareEntity();
          billShare.billId = newBill.id;
          billShare.ver = '1';
          billShare.memberId = v.id;
          billShare.method = v.method;
          billShare.value = v.value ?? null;
          billShare.amount = amount;

          await this.billShareAccess.save(billShare);

          return await this.updateMember(v.id, amount, true);
        })
      );

      await this.dbAccess.commitTransaction();

      return {
        members: await this.getMemberByBook(id),
        transaction: {
          ...newBill,
          former: data.former,
          latter: data.latter,
          history: [],
        },
      };
    } catch (e) {
      await this.dbAccess.rollbackTransaction();
      throw e;
    }
  }

  private async deleteOldBill(oldBill: Bill) {
    await this.billAccess.update({
      ...oldBill,
      dateDeleted: new Date().toISOString(),
    });

    const oldBillShares = await this.billShareAccess.findByBill(
      oldBill.id,
      oldBill.ver
    );

    const positive = oldBillShares.filter((v) => v.amount > 0);
    const negative = oldBillShares.filter((v) => v.amount < 0);
    await Promise.all(
      positive.map((v) =>
        this.updateMember(
          v.memberId,
          bn(v.amount).negated(),
          oldBill.type === BillType.In
        )
      )
    );
    await Promise.all(
      negative.map((v) =>
        this.updateMember(
          v.memberId,
          bn(v.amount).negated(),
          oldBill.type === BillType.Out
        )
      )
    );
  }

  public async updateBill(
    bookId: string,
    billId: string,
    data: PutBookBillRequest,
    deviceId: string
  ): Promise<PutBookBillResponse> {
    await this.checkDeviceHasBook(deviceId, bookId);

    try {
      await this.dbAccess.startTransaction();

      const oldBill = await this.billAccess.findUndeletedById(billId);
      await this.deleteOldBill(oldBill);

      const bill = new BillEntity();
      bill.id = billId;
      bill.ver = bn(oldBill.ver).plus(1).toString();
      bill.bookId = bookId;
      bill.date = data.date;
      bill.type = data.type;
      bill.descr = data.descr;
      bill.amount = data.amount;
      bill.memo = data.memo ?? null;

      const newBill = await this.billAccess.save(bill);
      this.validateDetail(data.amount, data.former);
      this.validateDetail(data.amount, data.latter);

      await Promise.all(
        data.former.map(async (v) => {
          let amount = v.amount;
          if (data.type === BillType.In) amount = v.amount * -1;

          const billShare = new BillShareEntity();
          billShare.billId = newBill.id;
          billShare.ver = bn(oldBill.ver).plus(1).toString();
          billShare.memberId = v.id;
          billShare.method = v.method;
          billShare.value = v.value ?? null;
          billShare.amount = amount;

          await this.billShareAccess.save(billShare);

          return await this.updateMember(v.id, amount);
        })
      );
      await Promise.all(
        data.latter.map(async (v) => {
          let amount = v.amount;
          if (data.type === BillType.Out) amount = v.amount * -1;

          const billShare = new BillShareEntity();
          billShare.billId = newBill.id;
          billShare.ver = bn(oldBill.ver).plus(1).toString();
          billShare.memberId = v.id;
          billShare.method = v.method;
          billShare.value = v.value ?? null;
          billShare.amount = amount;

          await this.billShareAccess.save(billShare);

          return await this.updateMember(v.id, amount, true);
        })
      );

      await this.dbAccess.commitTransaction();

      const billShares = await this.vBillShareAccess.findByBillId(newBill.id);

      return {
        members: await this.getMemberByBook(bookId),
        transaction: this.handleBill(billShares)[0],
      };
    } catch (e) {
      await this.dbAccess.rollbackTransaction();
      throw e;
    }
  }

  public async deleteBill(
    bookId: string,
    billId: string,
    deviceId: string
  ): Promise<DeleteBookBillResponse> {
    await this.checkDeviceHasBook(deviceId, bookId);

    try {
      await this.dbAccess.startTransaction();
      const bill = await this.billAccess.findUndeletedById(billId);
      await this.deleteOldBill(bill);

      await this.dbAccess.commitTransaction();

      const billShares = await this.vBillShareAccess.findByBillId(billId);

      return {
        members: await this.getMemberByBook(bookId),
        transaction: this.handleBill(billShares)[0],
      };
    } catch (e) {
      await this.dbAccess.rollbackTransaction();
      throw e;
    }
  }

  public async addTransfer(
    id: string,
    data: PostBookTransferRequest,
    deviceId: string
  ): Promise<PostBookTransferResponse> {
    await this.checkDeviceHasBook(deviceId, id);

    try {
      await this.dbAccess.startTransaction();

      const transfer = new TransferEntity();
      transfer.ver = '1';
      transfer.bookId = id;
      transfer.date = data.date;
      transfer.amount = data.amount;
      transfer.srcMemberId = data.srcMemberId;
      transfer.dstMemberId = data.dstMemberId;
      transfer.memo = data.memo ?? null;

      await this.updateMember(data.srcMemberId, bn(data.amount));
      await this.updateMember(data.dstMemberId, bn(data.amount).negated());
      const newTransfer = await this.transferAccess.save(transfer);

      await this.dbAccess.commitTransaction();

      return {
        members: await this.getMemberByBook(id),
        transaction: { ...newTransfer, type: 'transfer', history: [] },
      };
    } catch (e) {
      await this.dbAccess.rollbackTransaction();
      throw e;
    }
  }

  public async updateTransfer(
    bookId: string,
    transferId: string,
    data: PostBookTransferRequest,
    deviceId: string
  ): Promise<PutBookTransferResponse> {
    await this.checkDeviceHasBook(deviceId, bookId);

    try {
      await this.dbAccess.startTransaction();
      const oldTransfer = await this.transferAccess.findUndeletedById(
        transferId
      );

      await this.transferAccess.update({
        ...oldTransfer,
        dateDeleted: new Date().toISOString(),
      });
      await this.updateMember(
        oldTransfer.srcMemberId,
        bn(oldTransfer.amount).negated()
      );
      await this.updateMember(oldTransfer.dstMemberId, bn(oldTransfer.amount));

      const newTransfer = new TransferEntity();
      newTransfer.id = transferId;
      newTransfer.ver = bn(oldTransfer.ver).plus(1).toString();
      newTransfer.bookId = bookId;
      newTransfer.date = data.date;
      newTransfer.amount = data.amount;
      newTransfer.srcMemberId = data.srcMemberId;
      newTransfer.dstMemberId = data.dstMemberId;
      newTransfer.memo = data.memo ?? null;

      await this.updateMember(data.srcMemberId, bn(data.amount));
      await this.updateMember(data.dstMemberId, bn(data.amount).negated());
      await this.transferAccess.save(newTransfer);

      await this.dbAccess.commitTransaction();

      const transfers = await this.transferAccess.findById(transferId);

      return {
        members: await this.getMemberByBook(bookId),
        transaction: this.handleTransfer(transfers)[0],
      };
    } catch (e) {
      await this.dbAccess.rollbackTransaction();
      throw e;
    }
  }

  public async deleteTransfer(
    bookId: string,
    transferId: string,
    deviceId: string
  ): Promise<DeleteBookTransferResponse> {
    await this.checkDeviceHasBook(deviceId, bookId);

    try {
      await this.dbAccess.startTransaction();
      const transfer = await this.transferAccess.findUndeletedById(transferId);

      await this.updateMember(
        transfer.srcMemberId,
        bn(transfer.amount).negated()
      );
      await this.updateMember(transfer.dstMemberId, bn(transfer.amount));
      await this.transferAccess.update({
        ...transfer,
        dateDeleted: new Date().toISOString(),
      });

      await this.dbAccess.commitTransaction();

      const transfers = await this.transferAccess.findById(transferId);

      return {
        members: await this.getMemberByBook(bookId),
        transaction: this.handleTransfer(transfers)[0],
      };
    } catch (e) {
      await this.dbAccess.rollbackTransaction();
      throw e;
    }
  }
}
