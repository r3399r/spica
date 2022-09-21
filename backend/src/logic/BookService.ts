import { BadRequestError, UnauthorizedError } from '@y-celestial/service';
import { BigNumber } from 'bignumber.js';
import { inject, injectable } from 'inversify';
import { BillAccess } from 'src/access/BillAccess';
import { BillShareAccess } from 'src/access/BillShareAccess';
import { BookAccess } from 'src/access/BookAccess';
import { DbAccess } from 'src/access/DbAccess';
import { MemberAccess } from 'src/access/MemberAccess';
import { TransferAccess } from 'src/access/TransferAccess';
import { ViewBillShareAccess } from 'src/access/ViewBillShareAccess';
import { ViewTransactionAccess } from 'src/access/ViewTransactionAccess';
import {
  GetBookIdResponse,
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
import { BillEntity } from 'src/model/entity/BillEntity';
import { BillShareEntity } from 'src/model/entity/BillShareEntity';
import { BookEntity } from 'src/model/entity/BookEntity';
import { MemberEntity } from 'src/model/entity/MemberEntity';
import { TransferEntity } from 'src/model/entity/TransferEntity';
import { BillType, ShareDetail } from 'src/model/type/Book';
import {
  ViewTransactionBill,
  ViewTransactionTransfer,
} from 'src/model/viewEntity/ViewTransaction';
import { bn } from 'src/util/bignumber';
import { randomBase33 } from 'src/util/random';

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

  @inject(ViewBillShareAccess)
  private readonly viewBillShareAccess!: ViewBillShareAccess;

  @inject(ViewTransactionAccess)
  private readonly viewTransactionAccess!: ViewTransactionAccess;

  public async cleanup() {
    await this.dbAccess.cleanup();
  }

  public async createBook(data: PostBookRequest): Promise<PostBookResponse> {
    const book = new BookEntity();
    book.name = data.name;
    book.code = randomBase33(6);
    book.dateLastChanged = new Date();

    return await this.bookAccess.save(book);
  }

  private async validateBook(id: string, code: string) {
    const book = await this.bookAccess.findById(id);
    if (book.code !== code.toLowerCase()) throw new UnauthorizedError();

    return book;
  }

  public async getBookList(
    ids: string,
    code: string
  ): Promise<GetBookResponse> {
    const idArray = ids.split(',');
    const codeArray = code.split(',');
    if (idArray.length !== codeArray.length)
      throw new BadRequestError('bad request');

    const books = await this.bookAccess.findByIds(idArray);

    return books.filter((v) => {
      const idx = idArray.findIndex((id) => id === v.id);
      if (idx === -1 || codeArray[idx] !== v.code) return false;

      return true;
    });
  }

  public async getTransaction(
    id: string,
    code: string
  ): Promise<GetBookIdResponse> {
    const book = await this.validateBook(id, code);

    const members = await this.memberAccess.findByBookId(id);
    const billShares = await this.viewBillShareAccess.findByBookId(id);
    const transactions = (await this.viewTransactionAccess.findByBookId(
      id
    )) as (ViewTransactionBill | ViewTransactionTransfer)[];

    return {
      ...book,
      members,
      transactions: transactions.map((v) => {
        if (v.type === 'transfer')
          return {
            id: v.id,
            ver: v.ver,
            bookId: v.bookId,
            date: v.date,
            amount: v.amount,
            srcMemberId: v.srcMemberId,
            dstMemberId: v.dstMemberId,
            memo: v.memo,
            dateCreated: v.dateCreated,
            dateUpdated: v.dateUpdated,
            dateDeleted: v.dateDeleted,
          };
        else
          return {
            id: v.id,
            ver: v.ver,
            bookId: v.bookId,
            date: v.date,
            type: v.type,
            descr: v.descr,
            amount: v.amount,
            memo: v.memo,
            dateCreated: v.dateCreated,
            dateUpdated: v.dateUpdated,
            dateDeleted: v.dateDeleted,
            detail: billShares
              .filter((o) => o.billId === v.id && o.ver === v.ver)
              .map((o) => {
                const { bookId: ignoredBookId, ...rest } = o;

                return rest;
              }),
          };
      }),
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
    book.name = data.name;
    book.code = oldBook.code;
    book.dateLastChanged = new Date();

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
    member.nickname = data.nickname;
    member.bookId = id;

    return await this.memberAccess.save(member);
  }

  public async reviseMemberNickname(
    bid: string,
    mid: string,
    data: PutBookMemberRequest,
    code: string
  ): Promise<PutBookMemberResponse> {
    await this.validateBook(bid, code);

    const member = new MemberEntity();
    member.id = mid;
    member.bookId = bid;
    member.nickname = data.nickname;

    await this.memberAccess.update(member);

    return member;
  }

  public async deleteMember(bid: string, mid: string, code: string) {
    await this.validateBook(bid, code);

    await this.memberAccess.hardDeleteById(mid);
  }

  private validateDetail(amount: number, data: ShareDetail[]) {
    const memberWeight = data.filter((v) => v.type === BillType.Weight);
    const memberAmount = data.filter((v) => v.type === BillType.Amount);
    const memberPct = data.filter((v) => v.type === BillType.Pct);

    memberPct.forEach((v) => {
      if (v.value > 100) throw new BadRequestError('% shoulde less than 100');
    });

    // avoid multiple remainder taker
    const numTakeRemainder = data.filter(
      (v) => v.takeRemainder === true
    ).length;
    if (numTakeRemainder > 1)
      throw new BadRequestError('only 0 or 1 person could take remainder');

    // check input totoal is reasonable
    let inputTotal = bn(0);
    memberAmount.forEach((v) => {
      inputTotal = inputTotal.plus(v.value);
    });
    memberPct.forEach((v) => {
      const splited = bn(amount).times(v.value).div(100).dp(2, 1);
      inputTotal = inputTotal.plus(splited);
    });

    if (inputTotal.gt(amount))
      throw new BadRequestError('input total exceeds amount');
    if (inputTotal.lt(amount) && memberWeight.length === 0)
      throw new BadRequestError('may need someone to take the rest amount');

    const restAmount = bn(amount).minus(inputTotal);
    const totalWeights = BigNumber.sum(...memberWeight.map((v) => bn(v.value)));

    let weightTotal = bn(0);
    memberWeight.forEach((v) => {
      const splited = restAmount.div(totalWeights).times(v.value).dp(2, 1);
      weightTotal = weightTotal.plus(splited);
    });

    if (!weightTotal.eq(restAmount) && numTakeRemainder === 0)
      throw new BadRequestError('no one takes the remainder');
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
      bill.date = new Date(data.date);
      bill.type = data.type;
      bill.descr = data.descr;
      bill.amount = data.amount;
      bill.memo = data.memo ?? null;

      const newBill = await this.billAccess.save(bill);
      this.validateDetail(data.amount, data.former);
      this.validateDetail(data.amount, data.latter);

      const detail = await Promise.all([
        ...data.former.map(async (v) => {
          const billShare = new BillShareEntity();
          billShare.billId = newBill.id;
          billShare.ver = '1';
          billShare.memberId = v.id;
          billShare.side = 'former';
          billShare.type = v.type;
          billShare.value = v.value;
          billShare.takeRemainder = v.takeRemainder ?? false;

          return await this.billShareAccess.save(billShare);
        }),
        ...data.latter.map(async (v) => {
          const billShare = new BillShareEntity();
          billShare.billId = newBill.id;
          billShare.ver = '1';
          billShare.memberId = v.id;
          billShare.side = 'latter';
          billShare.type = v.type;
          billShare.value = v.value;
          billShare.takeRemainder = v.takeRemainder ?? false;

          return await this.billShareAccess.save(billShare);
        }),
      ]);

      await this.dbAccess.commitTransaction();

      return { ...newBill, detail };
    } catch (e) {
      await this.dbAccess.rollbackTransaction();
      throw e;
    }
  }

  public async updateBill(
    bid: string,
    billId: string,
    data: PutBookBillRequest,
    code: string
  ): Promise<PutBookBillResponse> {
    await this.validateBook(bid, code);

    try {
      await this.dbAccess.startTransaction();
      const oldBill = await this.billAccess.findUndeletedById(billId);

      await this.billAccess.update({
        ...oldBill,
        dateDeleted: new Date(),
      });

      const bill = new BillEntity();
      bill.id = billId;
      bill.ver = bn(oldBill.ver).plus(1).toString();
      bill.bookId = bid;
      bill.date = new Date(data.date);
      bill.type = data.type;
      bill.descr = data.descr;
      bill.amount = data.amount;
      bill.memo = data.memo ?? null;

      const newBill = await this.billAccess.save(bill);

      const oldBillShares = await this.billShareAccess.findByBill(
        billId,
        oldBill.ver
      );

      await Promise.all(
        oldBillShares.map(async (v) => {
          await this.billShareAccess.update({
            ...v,
            dateDeleted: new Date(),
          });
        })
      );

      this.validateDetail(data.amount, data.former);
      this.validateDetail(data.amount, data.latter);

      const detail = await Promise.all([
        ...data.former.map(async (v) => {
          const billShare = new BillShareEntity();
          billShare.billId = billId;
          billShare.ver = bn(oldBill.ver).plus(1).toString();
          billShare.memberId = v.id;
          billShare.side = 'former';
          billShare.type = v.type;
          billShare.value = v.value;
          billShare.takeRemainder = v.takeRemainder ?? false;

          return await this.billShareAccess.save(billShare);
        }),
        ...data.latter.map(async (v) => {
          const billShare = new BillShareEntity();
          billShare.billId = billId;
          billShare.ver = bn(oldBill.ver).plus(1).toString();
          billShare.memberId = v.id;
          billShare.side = 'latter';
          billShare.type = v.type;
          billShare.value = v.value;
          billShare.takeRemainder = v.takeRemainder ?? false;

          return await this.billShareAccess.save(billShare);
        }),
      ]);

      await this.dbAccess.commitTransaction();

      return { ...newBill, detail };
    } catch (e) {
      await this.dbAccess.rollbackTransaction();
      throw e;
    }
  }

  public async deleteBill(bid: string, billId: string, code: string) {
    await this.validateBook(bid, code);

    const bill = await this.billAccess.findUndeletedById(billId);

    await this.billAccess.update({
      ...bill,
      dateDeleted: new Date(),
    });

    const billShares = await this.billShareAccess.findByBill(billId, bill.ver);

    await Promise.all(
      billShares.map(async (v) => {
        await this.billShareAccess.update({
          ...v,
          dateDeleted: new Date(),
        });
      })
    );
  }

  public async addTransfer(
    id: string,
    data: PostBookTransferRequest,
    code: string
  ): Promise<PostBookTransferResponse> {
    await this.validateBook(id, code);

    const transfer = new TransferEntity();
    transfer.ver = '1';
    transfer.bookId = id;
    transfer.date = new Date(data.date);
    transfer.amount = data.amount;
    transfer.srcMemberId = data.srcMemberId;
    transfer.dstMemberId = data.dstMemberId;
    transfer.memo = data.memo ?? null;

    return await this.transferAccess.save(transfer);
  }

  public async updateTransfer(
    bid: string,
    tid: string,
    data: PostBookTransferRequest,
    code: string
  ): Promise<PutBookTransferResponse> {
    await this.validateBook(bid, code);

    try {
      await this.dbAccess.startTransaction();
      const oldTransfer = await this.transferAccess.findUndeletedById(tid);

      await this.transferAccess.update({
        ...oldTransfer,
        dateDeleted: new Date(),
      });

      const newTransfer = new TransferEntity();
      newTransfer.id = tid;
      newTransfer.ver = bn(oldTransfer.ver).plus(1).toString();
      newTransfer.bookId = bid;
      newTransfer.date = new Date(data.date);
      newTransfer.amount = data.amount;
      newTransfer.srcMemberId = data.srcMemberId;
      newTransfer.dstMemberId = data.dstMemberId;
      newTransfer.memo = data.memo ?? null;

      const res = await this.transferAccess.save(newTransfer);

      await this.dbAccess.commitTransaction();

      return res;
    } catch (e) {
      await this.dbAccess.rollbackTransaction();
      throw e;
    }
  }

  public async deleteTransfer(bid: string, tid: string, code: string) {
    await this.validateBook(bid, code);

    const transfer = await this.transferAccess.findUndeletedById(tid);

    await this.transferAccess.update({
      ...transfer,
      dateDeleted: new Date(),
    });
  }
}
