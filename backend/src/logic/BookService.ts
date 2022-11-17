import { BigNumber } from 'bignumber.js';
import { inject, injectable } from 'inversify';
import { BillAccess } from 'src/access/BillAccess';
import { BillShareAccess } from 'src/access/BillShareAccess';
import { BookAccess } from 'src/access/BookAccess';
import { DbAccess } from 'src/access/DbAccess';
import { MemberAccess } from 'src/access/MemberAccess';
import { TransferAccess } from 'src/access/TransferAccess';
import { ViewBillShareAccess } from 'src/access/ViewBillShareAccess';
import { ViewBookAccess } from 'src/access/ViewBookAccess';
import {
  BadRequestError,
  UnauthorizedError,
} from 'src/celestial-service/error';
import { compare } from 'src/celestial-service/util/compare';
import {
  differenceBy,
  intersectionBy,
} from 'src/celestial-service/util/setTheory';
import { BillType } from 'src/constant/Book';
import {
  DeleteBookBillResponse,
  DeleteBookTransferResponse,
  GetBookIdResponse,
  GetBookNameResponse,
  GetBookParams,
  GetBookResponse,
  PostBookBillRequest,
  PostBookBillResponse,
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
  PutBookTransferResponse,
} from 'src/model/api/Book';
import { Bill } from 'src/model/entity/Bill';
import { BillEntity } from 'src/model/entity/BillEntity';
import { BillShareEntity } from 'src/model/entity/BillShareEntity';
import { BookEntity } from 'src/model/entity/BookEntity';
import { Member } from 'src/model/entity/Member';
import { MemberEntity } from 'src/model/entity/MemberEntity';
import { Transfer } from 'src/model/entity/Transfer';
import { TransferEntity } from 'src/model/entity/TransferEntity';
import {
  History,
  ShareDetail,
  TransactionBill,
  TransactionTransfer,
} from 'src/model/type/Book';
import { ViewBillShare } from 'src/model/viewEntity/ViewBillShare';
import { bn } from 'src/util/bignumber';
import { randomBase10 } from 'src/util/random';

/**
 * Service class for Book
 */
@injectable()
export class BookService {
  @inject(DbAccess)
  private readonly dbAccess!: DbAccess;

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

  public async cleanup() {
    await this.dbAccess.cleanup();
  }

  public async createBook(data: PostBookRequest): Promise<PostBookResponse> {
    const book = new BookEntity();
    book.name = data.name;
    book.code = randomBase10(6);
    book.symbol = data.symbol ?? '$';

    return await this.bookAccess.save(book);
  }

  private async validateBook(id: string, code: string) {
    const book = await this.vBookAccess.findById(id);
    if (book.code !== code.toLowerCase()) throw new UnauthorizedError();

    return book;
  }

  public async getBookList(
    params: GetBookParams,
    code: string
  ): Promise<GetBookResponse> {
    const idArray = params.ids.split(',');
    const codeArray = code.split(',');
    if (idArray.length !== codeArray.length)
      throw new BadRequestError('bad request');

    const books = await this.vBookAccess.findByIds(idArray);

    return books
      .filter((v) => {
        const idx = idArray.findIndex((id) => id === v.id);
        if (idx === -1 || codeArray[idx] !== v.code) return false;

        return true;
      })
      .sort(compare('dateCreated'));
  }

  public async getBookNameById(id: string): Promise<GetBookNameResponse> {
    const book = await this.vBookAccess.findById(id);

    return { id: book.id, name: book.name };
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
          dateCreated: tx.dateCreated,
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
                  memberDateCreated: share.memberDateCreated,
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
                  memberDateCreated: share.memberDateCreated,
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
                  memberDateCreated: share.memberDateCreated,
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
                  memberDateCreated: share.memberDateCreated,
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
          former: tx.former.sort(compare('memberDateCreated')),
          latter: tx.latter.sort(compare('memberDateCreated')),
        });
      else {
        const lastTx = res[idx];
        const diff = this.compareTxBill(lastTx, tx);
        res[idx] = {
          ...tx,
          former: tx.former.sort(compare('memberDateCreated')),
          latter: tx.latter.sort(compare('memberDateCreated')),
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

  public async getBook(id: string, code: string): Promise<GetBookIdResponse> {
    const book = await this.validateBook(id, code);
    const [members, transfers, billShares] = await Promise.all([
      this.getMemberByBook(id),
      this.transferAccess.findByBookId(id),
      this.vBillShareAccess.findByBookId(id),
    ]);

    return {
      ...book,
      members,
      transactions: [
        ...this.handleTransfer(transfers),
        ...this.handleBill(billShares),
      ].sort(compare('date', 'desc')),
    };
  }

  public async reviseBook(
    id: string,
    data: PutBookRequest,
    code: string
  ): Promise<PutBookResponse> {
    const oldBook = await this.validateBook(id, code);

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
    code: string
  ): Promise<PostBookMemberResponse> {
    await this.validateBook(id, code);

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
    code: string
  ): Promise<PutBookMemberResponse> {
    await this.validateBook(bid, code);

    const oldMember = await this.memberAccess.findById(mid);
    if (oldMember.bookId !== bid) throw new BadRequestError('bad request');

    const newMember: Member = {
      ...oldMember,
      nickname: data.nickname,
    };
    await this.memberAccess.update(newMember);

    return newMember;
  }

  public async deleteMember(bid: string, mid: string, code: string) {
    await this.validateBook(bid, code);
    const member = await this.memberAccess.findById(mid);
    if (member.bookId !== bid) throw new BadRequestError('bad request');
    if (member.deletable === false) throw new BadRequestError('not deletable');

    await this.memberAccess.hardDeleteById(mid);
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
    code: string
  ): Promise<PostBookBillResponse> {
    await this.validateBook(id, code);

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
    code: string
  ): Promise<PutBookBillResponse> {
    await this.validateBook(bookId, code);

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
    code: string
  ): Promise<DeleteBookBillResponse> {
    await this.validateBook(bookId, code);

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
    code: string
  ): Promise<PostBookTransferResponse> {
    await this.validateBook(id, code);

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
      await this.transferAccess.save(transfer);

      await this.dbAccess.commitTransaction();

      return {
        members: await this.getMemberByBook(id),
        transaction: { ...transfer, type: 'transfer', history: [] },
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
    code: string
  ): Promise<PutBookTransferResponse> {
    await this.validateBook(bookId, code);

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
    code: string
  ): Promise<DeleteBookTransferResponse> {
    await this.validateBook(bookId, code);

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
