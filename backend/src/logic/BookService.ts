import { BigNumber } from 'bignumber.js';
import { inject, injectable } from 'inversify';
import { BillAccess } from 'src/access/BillAccess';
import { BillShareAccess } from 'src/access/BillShareAccess';
import { BookAccess } from 'src/access/BookAccess';
import { CurrencyAccess } from 'src/access/CurrencyAccess';
import { DeviceBookAccess } from 'src/access/DeviceBookAccess';
import { MemberAccess } from 'src/access/MemberAccess';
import { MemberSettlementAccess } from 'src/access/MemberSettlementAccess';
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
  PostBookCurrencyRequest,
  PostBookCurrencyResponse,
  PostBookIdResponse,
  PostBookMemberRequest,
  PostBookMemberResponse,
  PostBookRequest,
  PostBookResponse,
  PostBookTransferRequest,
  PostBookTransferResponse,
  PutBookBillRequest,
  PutBookBillResponse,
  PutBookCurrencyPrimaryResponse,
  PutBookCurrencyRequest,
  PutBookCurrencyResponse,
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
import { Currency } from 'src/model/entity/Currency';
import { CurrencyEntity } from 'src/model/entity/CurrencyEntity';
import { DeviceBookEntity } from 'src/model/entity/DeviceBookEntity';
import { Member } from 'src/model/entity/Member';
import { MemberEntity } from 'src/model/entity/MemberEntity';
import { MemberSettlement } from 'src/model/entity/MemberSettlement';
import { MemberSettlementEntity } from 'src/model/entity/MemberSettlementEntity';
import { Transfer } from 'src/model/entity/Transfer';
import { TransferEntity } from 'src/model/entity/TransferEntity';
import { BadRequestError, InternalServerError } from 'src/model/error';
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
  @inject(DeviceBookAccess)
  private readonly deviceBookAccess!: DeviceBookAccess;

  @inject(BookAccess)
  private readonly bookAccess!: BookAccess;

  @inject(MemberAccess)
  private readonly memberAccess!: MemberAccess;

  @inject(MemberSettlementAccess)
  private readonly memberSettlementAccess!: MemberSettlementAccess;

  @inject(CurrencyAccess)
  private readonly currencyAccess!: CurrencyAccess;

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

    const currency = new CurrencyEntity();
    currency.bookId = newBook.id;
    currency.name = 'TWD';
    currency.symbol = '$';
    currency.isPrimary = true;
    currency.deletable = false;
    const newCurrency = await this.currencyAccess.save(currency);

    if (data.nickname) {
      const member = new MemberEntity();
      member.bookId = newBook.id;
      member.nickname = data.nickname;
      member.deviceId = deviceId;
      member.total = 0;
      member.balance = 0;
      member.deletable = true;
      const newMember = await this.memberAccess.save(member);

      const memberSettlement = new MemberSettlementEntity();
      memberSettlement.memberId = newMember.id;
      memberSettlement.currencyId = newCurrency.id;
      memberSettlement.balance = 0;
      memberSettlement.total = 0;
      await this.memberSettlementAccess.save(memberSettlement);
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
    if (oldTx.amount !== newTx.amount || oldTx.currencyId !== newTx.currencyId)
      items.push({
        key: 'amount',
        from: `${oldTx.currencyId}:${oldTx.amount}`,
        to: `${newTx.currencyId}:${newTx.amount}`,
      });
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
    if (oldTx.amount !== newTx.amount || oldTx.currencyId !== newTx.currencyId)
      items.push({
        key: 'amount',
        from: `${oldTx.currencyId}:${oldTx.amount}`,
        to: `${newTx.currencyId}:${newTx.amount}`,
      });
    if (oldTx.descr !== newTx.descr)
      items.push({ key: 'descr', from: oldTx.descr, to: newTx.descr });
    if (oldTx.memo !== newTx.memo)
      items.push({ key: 'memo', from: oldTx.memo, to: newTx.memo });

    const sameFormer = intersectionBy(newTx.former, oldTx.former, 'id');
    for (const former of sameFormer) {
      const old = oldTx.former.find((v) => v.id === former.id);
      if (
        old?.amount !== former.amount ||
        oldTx.currencyId !== newTx.currencyId
      )
        items.push({
          key: 'former',
          from: `${old?.id}:${oldTx.currencyId}:${old?.amount}`,
          to: `${former.id}:${newTx.currencyId}:${former.amount}`,
        });
    }
    const addFormer = differenceBy(newTx.former, oldTx.former, 'id');
    for (const former of addFormer)
      items.push({
        key: 'former',
        from: null,
        to: `${former.id}:${newTx.currencyId}:${former.amount}`,
      });

    const minusFormer = differenceBy(oldTx.former, newTx.former, 'id');
    for (const former of minusFormer)
      items.push({
        key: 'former',
        from: `${former.id}:${oldTx.currencyId}:${former.amount}`,
        to: null,
      });

    const sameLatter = intersectionBy(newTx.latter, oldTx.latter, 'id');
    for (const latter of sameLatter) {
      const old = oldTx.latter.find((v) => v.id === latter.id);
      if (
        old?.amount !== latter.amount ||
        oldTx.currencyId !== newTx.currencyId
      )
        items.push({
          key: 'latter',
          from: `${old?.id}:${oldTx.currencyId}:${old?.amount}`,
          to: `${latter.id}:${newTx.currencyId}:${latter.amount}`,
        });
    }
    const addLatter = differenceBy(newTx.latter, oldTx.latter, 'id');
    for (const latter of addLatter)
      items.push({
        key: 'latter',
        from: null,
        to: `${latter.id}:${newTx.currencyId}:${latter.amount}`,
      });

    const minusLatter = differenceBy(oldTx.latter, newTx.latter, 'id');
    for (const latter of minusLatter)
      items.push({
        key: 'latter',
        from: `${latter.id}:${oldTx.currencyId}:${latter.amount}`,
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
          currencyId: tx.currencyId,
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
          currencyId: tx.currencyId,
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
          currencyId: share.currencyId,
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
    const memberSettles = await this.memberSettlementAccess.find({
      where: { currency: { bookId: id } },
    });

    let res: Member[] = [];
    let sumBalance = bn(0);
    for (const member of members) {
      const settles = memberSettles.filter((v) => v.memberId === member.id);
      const balance = settles
        .reduce(
          (prev, current) =>
            bn(current.balance)
              .times(current.currency.exchangeRate ?? 1)
              .plus(prev),
          bn(0)
        )
        .dp(2)
        .toNumber();
      sumBalance = sumBalance.plus(balance);

      const total = settles
        .reduce(
          (prev, current) =>
            bn(current.total)
              .times(current.currency.exchangeRate ?? 1)
              .plus(prev),
          bn(0)
        )
        .dp(2)
        .toNumber();
      res.push({
        ...member,
        balance,
        total,
      });
    }

    // non-zero sumBalance means that "Should Receive" is not equal to "Should Pay"
    if (!sumBalance.eq(0))
      res = [...res]
        .sort(compare('balance', 'desc'))
        .map((v, i) =>
          i === 0
            ? { ...v, balance: bn(v.balance).minus(sumBalance).toNumber() }
            : v
        );

    return res.sort(compare('dateCreated'));
  }

  private async getBookDetail(
    book: ViewBook,
    paginate?: PaginationParams | null
  ): Promise<Pagination<BookDetail>> {
    const limit = paginate ? Number(paginate.limit) : 50;
    const offset = paginate ? Number(paginate.offset) : 0;

    const [members, currencies, { data: tx, count }] = await Promise.all([
      this.getMemberByBook(book.id),
      this.currencyAccess.findByBookId(book.id),
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
        currencies: currencies.sort(compare('dateCreated')),
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

    const newMember = await this.memberAccess.save(member);
    const currencies = await this.currencyAccess.findByBookId(id);
    await Promise.all(
      currencies.map((v) => {
        const membersettlement = new MemberSettlementEntity();
        membersettlement.memberId = newMember.id;
        membersettlement.currencyId = v.id;
        membersettlement.balance = 0;
        membersettlement.total = 0;

        return this.memberSettlementAccess.save(membersettlement);
      })
    );

    return newMember;
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
    memberId: string,
    currencyId: string,
    amount: number | BigNumber,
    updateTotal = false
  ) {
    const oldMember = await this.memberAccess.findById(memberId);
    const newMember: Member = {
      ...oldMember,
      // total & balance are depreacated
      total: updateTotal
        ? bn(oldMember.total).plus(amount).toNumber()
        : oldMember.total,
      balance: bn(oldMember.balance).plus(amount).toNumber(),
      deletable: false,
    };
    await this.memberAccess.update(newMember);

    // feature multiple currencies
    const oldMemberSettlement = await this.memberSettlementAccess.findOneOrFail(
      { where: { memberId, currencyId } }
    );
    const newMemberSettlement: MemberSettlement = {
      ...oldMemberSettlement,
      total: updateTotal
        ? bn(oldMemberSettlement.total).plus(amount).toNumber()
        : oldMemberSettlement.total,
      balance: bn(oldMemberSettlement.balance).plus(amount).toNumber(),
    };
    await this.memberSettlementAccess.save(newMemberSettlement);

    const currency = await this.currencyAccess.findById(currencyId);
    if (currency.deletable === true) {
      currency.deletable = false;
      await this.currencyAccess.save(currency);
    }

    return newMember;
  }

  public async addBill(
    id: string,
    data: PostBookBillRequest,
    deviceId: string
  ): Promise<PostBookBillResponse> {
    await this.checkDeviceHasBook(deviceId, id);

    const bill = new BillEntity();
    bill.ver = '1';
    bill.bookId = id;
    bill.date = data.date;
    bill.type = data.type;
    bill.descr = data.descr;
    bill.amount = data.amount;
    bill.memo = data.memo ?? null;
    bill.currencyId =
      data.currencyId ?? (await this.currencyAccess.findPrimaryByBookId(id)).id;

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

        return await this.updateMember(v.id, newBill.currencyId, amount);
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

        return await this.updateMember(v.id, newBill.currencyId, amount, true);
      })
    );

    return {
      members: await this.getMemberByBook(id),
      transaction: {
        ...newBill,
        former: data.former,
        latter: data.latter,
        history: [],
      },
    };
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
          oldBill.currencyId,
          bn(v.amount).negated(),
          oldBill.type === BillType.In
        )
      )
    );
    await Promise.all(
      negative.map((v) =>
        this.updateMember(
          v.memberId,
          oldBill.currencyId,
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
    bill.currencyId =
      data.currencyId ??
      (await this.currencyAccess.findPrimaryByBookId(bookId)).id;

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

        return await this.updateMember(v.id, newBill.currencyId, amount);
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

        return await this.updateMember(v.id, newBill.currencyId, amount, true);
      })
    );

    const billShares = await this.vBillShareAccess.findByBillId(newBill.id);

    return {
      members: await this.getMemberByBook(bookId),
      transaction: this.handleBill(billShares)[0],
    };
  }

  public async deleteBill(
    bookId: string,
    billId: string,
    deviceId: string
  ): Promise<DeleteBookBillResponse> {
    await this.checkDeviceHasBook(deviceId, bookId);

    const bill = await this.billAccess.findUndeletedById(billId);
    await this.deleteOldBill(bill);

    const billShares = await this.vBillShareAccess.findByBillId(billId);

    return {
      members: await this.getMemberByBook(bookId),
      transaction: this.handleBill(billShares)[0],
    };
  }

  public async addTransfer(
    id: string,
    data: PostBookTransferRequest,
    deviceId: string
  ): Promise<PostBookTransferResponse> {
    await this.checkDeviceHasBook(deviceId, id);

    const transfer = new TransferEntity();
    transfer.ver = '1';
    transfer.bookId = id;
    transfer.date = data.date;
    transfer.amount = data.amount;
    transfer.srcMemberId = data.srcMemberId;
    transfer.dstMemberId = data.dstMemberId;
    transfer.memo = data.memo ?? null;
    transfer.currencyId =
      data.currencyId ?? (await this.currencyAccess.findPrimaryByBookId(id)).id;

    const newTransfer = await this.transferAccess.save(transfer);
    await this.updateMember(
      data.srcMemberId,
      newTransfer.currencyId,
      bn(data.amount)
    );
    await this.updateMember(
      data.dstMemberId,
      newTransfer.currencyId,
      bn(data.amount).negated()
    );

    return {
      members: await this.getMemberByBook(id),
      transaction: { ...newTransfer, type: 'transfer', history: [] },
    };
  }

  public async updateTransfer(
    bookId: string,
    transferId: string,
    data: PostBookTransferRequest,
    deviceId: string
  ): Promise<PutBookTransferResponse> {
    await this.checkDeviceHasBook(deviceId, bookId);

    const oldTransfer = await this.transferAccess.findUndeletedById(transferId);

    await this.transferAccess.update({
      ...oldTransfer,
      dateDeleted: new Date().toISOString(),
    });
    await this.updateMember(
      oldTransfer.srcMemberId,
      oldTransfer.currencyId,
      bn(oldTransfer.amount).negated()
    );
    await this.updateMember(
      oldTransfer.dstMemberId,
      oldTransfer.currencyId,
      bn(oldTransfer.amount)
    );

    const transfer = new TransferEntity();
    transfer.id = transferId;
    transfer.ver = bn(oldTransfer.ver).plus(1).toString();
    transfer.bookId = bookId;
    transfer.date = data.date;
    transfer.amount = data.amount;
    transfer.srcMemberId = data.srcMemberId;
    transfer.dstMemberId = data.dstMemberId;
    transfer.memo = data.memo ?? null;
    transfer.currencyId =
      data.currencyId ??
      (await this.currencyAccess.findPrimaryByBookId(bookId)).id;

    const newTransfer = await this.transferAccess.save(transfer);
    await this.updateMember(
      data.srcMemberId,
      newTransfer.currencyId,
      bn(data.amount)
    );
    await this.updateMember(
      data.dstMemberId,
      newTransfer.currencyId,
      bn(data.amount).negated()
    );

    const transfers = await this.transferAccess.findById(transferId);

    return {
      members: await this.getMemberByBook(bookId),
      transaction: this.handleTransfer(transfers)[0],
    };
  }

  public async deleteTransfer(
    bookId: string,
    transferId: string,
    deviceId: string
  ): Promise<DeleteBookTransferResponse> {
    await this.checkDeviceHasBook(deviceId, bookId);

    const transfer = await this.transferAccess.findUndeletedById(transferId);

    await this.updateMember(
      transfer.srcMemberId,
      transfer.currencyId,
      bn(transfer.amount).negated()
    );
    await this.updateMember(
      transfer.dstMemberId,
      transfer.currencyId,
      bn(transfer.amount)
    );
    await this.transferAccess.update({
      ...transfer,
      dateDeleted: new Date().toISOString(),
    });

    const transfers = await this.transferAccess.findById(transferId);

    return {
      members: await this.getMemberByBook(bookId),
      transaction: this.handleTransfer(transfers)[0],
    };
  }

  public async addCurrency(
    id: string,
    data: PostBookCurrencyRequest,
    deviceId: string
  ): Promise<PostBookCurrencyResponse> {
    await this.checkDeviceHasBook(deviceId, id);

    const currency = new CurrencyEntity();
    currency.bookId = id;
    currency.name = data.name;
    currency.symbol = data.symbol;
    currency.exchangeRate = data.exchangeRate;
    currency.isPrimary = false;
    currency.deletable = true;

    const newCurrency = await this.currencyAccess.save(currency);
    const members = await this.memberAccess.findByBookId(id);
    await Promise.all(
      members.map((v) => {
        const membersettlement = new MemberSettlementEntity();
        membersettlement.memberId = v.id;
        membersettlement.currencyId = newCurrency.id;
        membersettlement.balance = 0;
        membersettlement.total = 0;

        return this.memberSettlementAccess.save(membersettlement);
      })
    );

    return newCurrency;
  }

  public async updateCurrency(
    bookId: string,
    currencyId: string,
    data: PutBookCurrencyRequest,
    deviceId: string
  ): Promise<PutBookCurrencyResponse> {
    await this.checkDeviceHasBook(deviceId, bookId);

    const oldCurrency = await this.currencyAccess.findById(currencyId);
    if (oldCurrency.bookId !== bookId) throw new BadRequestError('bad request');
    const newCurrency: Currency = {
      ...oldCurrency,
      name: data.name,
      symbol: data.symbol,
      exchangeRate: data.exchangeRate ?? oldCurrency.exchangeRate,
    };
    await this.currencyAccess.save(newCurrency);

    return {
      currency: newCurrency,
      members: await this.getMemberByBook(bookId),
    };
  }

  private async checkCurrencyIsDeletable(currencyId: string) {
    const bills = await this.billAccess.findByCurrencyId(currencyId);
    if (bills.length > 0) return false;
    const transfers = await this.transferAccess.findByCurrencyId(currencyId);
    if (transfers.length > 0) return false;

    return true;
  }

  public async deleteCurrency(
    bookId: string,
    currencyId: string,
    deviceId: string
  ) {
    await this.checkDeviceHasBook(deviceId, bookId);

    const currency = await this.currencyAccess.findById(currencyId);
    if (currency.bookId !== bookId) throw new BadRequestError('bad request');
    if (currency.deletable === false)
      throw new BadRequestError('not deletable');

    const isDeletable = await this.checkCurrencyIsDeletable(currencyId);
    if (!isDeletable) throw new BadRequestError('not deletable');

    const memberSettlements =
      await this.memberSettlementAccess.findByCurrencyId(currencyId);

    await Promise.all(
      memberSettlements.map((v) =>
        this.memberSettlementAccess.hardDeleteById(v.id)
      )
    );

    await this.currencyAccess.hardDeleteById(currencyId);
  }

  public async reviseCurrencyPrimary(
    bookId: string,
    currencyId: string,
    deviceId: string
  ): Promise<PutBookCurrencyPrimaryResponse> {
    await this.checkDeviceHasBook(deviceId, bookId);

    const currencies = await this.currencyAccess.findByBookId(bookId);
    const newPrimaryCurrency = currencies.find((v) => v.id === currencyId);
    const oldPrimaryCurrency = currencies.find((v) => v.isPrimary === true);
    if (
      newPrimaryCurrency === undefined ||
      oldPrimaryCurrency === undefined ||
      newPrimaryCurrency.exchangeRate === null
    )
      throw new InternalServerError('something works unexpected');

    const newCurrencies: Currency[] = [];
    for (const currency of currencies) {
      const temp = { ...currency };
      // is old primary and set as secondary
      if (temp.id === oldPrimaryCurrency.id) {
        temp.isPrimary = false;
        temp.deletable = await this.checkCurrencyIsDeletable(temp.id);
        temp.exchangeRate = bn(1)
          .div(newPrimaryCurrency.exchangeRate)
          .dp(6)
          .toNumber();
      }
      // is new primary and set as primary
      else if (temp.id === newPrimaryCurrency.id) {
        temp.isPrimary = true;
        temp.deletable = false;
        temp.exchangeRate = null;
      }
      // is still secondary
      else {
        if (temp.exchangeRate === null)
          throw new InternalServerError('exchange rate should be not null');
        temp.exchangeRate = bn(temp.exchangeRate)
          .div(newPrimaryCurrency.exchangeRate)
          .dp(6)
          .toNumber();
      }
      // to avoid extreme value
      if (temp.exchangeRate === 0) temp.exchangeRate = 0.000001;
      newCurrencies.push(temp);
    }

    await Promise.all(newCurrencies.map((v) => this.currencyAccess.save(v)));

    return {
      currencies: newCurrencies.sort(compare('dateCreated')),
      members: await this.getMemberByBook(bookId),
    };
  }
}
