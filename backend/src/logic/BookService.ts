import { BadRequestError, UnauthorizedError } from '@y-celestial/service';
import { inject, injectable } from 'inversify';
import { BillAccess } from 'src/access/BillAccess';
import { BillShareAccess } from 'src/access/BillShareAccess';
import { BookAccess } from 'src/access/BookAccess';
import { DbAccess } from 'src/access/DbAccess';
import { MemberAccess } from 'src/access/MemberAccess';
import { TransferAccess } from 'src/access/TransferAccess';
import {
  PostBookBillRequest,
  PostBookMemberRequest,
  PostBookRequest,
  PostBookResponse,
  PostBookTransferRequest,
  PutBookBillRequest,
  PutBookMemberRequest,
  PutBookRequest,
} from 'src/model/api/Book';
import { AuthHeaders } from 'src/model/api/Common';
import { BillEntity } from 'src/model/entity/BillEntity';
import { BillShareEntity } from 'src/model/entity/BillShareEntity';
import { BookEntity } from 'src/model/entity/BookEntity';
import { MemberEntity } from 'src/model/entity/MemberEntity';
import { TransferEntity } from 'src/model/entity/TransferEntity';
import { BillData } from 'src/model/type/Book';
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
    if (book.code !== code) throw new UnauthorizedError();

    return book;
  }

  public async reviseBook(
    id: string,
    data: PutBookRequest,
    headers: AuthHeaders
  ) {
    const oldBook = await this.validateBook(id, headers['x-api-code']);

    const book = new BookEntity();
    book.id = id;
    book.name = data.name;
    book.code = oldBook.code;
    book.dateLastChanged = new Date();

    await this.bookAccess.update(book);
  }

  public async addMember(
    id: string,
    data: PostBookMemberRequest,
    headers: AuthHeaders
  ) {
    await this.validateBook(id, headers['x-api-code']);

    const member = new MemberEntity();
    member.nickname = data.nickname;
    member.bookId = id;
    member.deletable = true;

    await this.memberAccess.save(member);
  }

  public async reviseMemberNickname(
    bid: string,
    mid: string,
    data: PutBookMemberRequest,
    headers: AuthHeaders
  ) {
    await this.validateBook(bid, headers['x-api-code']);

    const oldMember = await this.memberAccess.findById(mid);
    const member = new MemberEntity();
    member.id = mid;
    member.bookId = bid;
    member.nickname = data.nickname;
    member.deletable = oldMember.deletable;

    await this.memberAccess.update(member);
  }

  public async deleteMember(bid: string, mid: string, headers: AuthHeaders) {
    await this.validateBook(bid, headers['x-api-code']);

    const member = await this.memberAccess.findById(mid);
    if (member.deletable === false)
      throw new BadRequestError('the member is not deletable');

    await this.memberAccess.hardDeleteById(mid);
  }

  private validateBill(data: BillData) {
    const formerAmount = data.former
      .map((v) => v.amount ?? 0)
      .reduce((prev, current) => prev + current, 0);
    const latterAmount = data.latter
      .map((v) => v.amount ?? 0)
      .reduce((prev, current) => prev + current, 0);

    if (formerAmount > data.amount || latterAmount > data.amount)
      throw new BadRequestError('sum of shared amount is too big');

    if (
      (data.former.length ===
        data.former.filter((v) => v.amount !== undefined).length &&
        data.amount !== formerAmount) ||
      (data.former.length ===
        data.latter.filter((v) => v.amount !== undefined).length &&
        data.amount !== latterAmount)
    )
      throw new BadRequestError('sum of shared amount cannot afford');

    if (
      data.former.length ===
        data.former.filter((v) => v.amount === undefined && v.weight === 0)
          .length ||
      data.latter.length ===
        data.latter.filter((v) => v.amount === undefined && v.weight === 0)
          .length
    )
      throw new BadRequestError('nobody is going to afford');

    if (
      !data.former.map((v) => v.id).includes(data.formerRemainder) ||
      !data.latter.map((v) => v.id).includes(data.latterRemainder)
    )
      throw new BadRequestError('nobody takes the remainder');

    return { formerAmount, latterAmount };
  }

  private getShare(
    data: BillData,
    formerAmount: number,
    latterAmount: number,
    billId: string
  ) {
    const formerWeight = data.former
      .map((v) => (v.amount !== undefined ? 0 : v.weight ?? 1))
      .reduce((prev, current) => prev + current, 0);
    const latterWeight = data.latter
      .map((v) => (v.amount !== undefined ? 0 : v.weight ?? 1))
      .reduce((prev, current) => prev + current, 0);

    let formerTotal = 0;
    let latterTotal = 0;
    const former = data.former.map((v) => {
      const amount =
        v.amount !== undefined
          ? v.amount
          : bn(data.amount)
              .minus(formerAmount)
              .div(formerWeight)
              .times(v.weight ?? 1)
              .dp(2, 1)
              .toNumber();
      formerTotal += amount;

      return {
        billId,
        memberId: v.id,
        amount: data.type === 'expense' ? amount : amount * -1,
      };
    });
    const latter = data.latter.map((v) => {
      const amount =
        v.amount !== undefined
          ? v.amount
          : bn(data.amount)
              .minus(latterAmount)
              .div(latterWeight)
              .times(v.weight ?? 1)
              .dp(2, 1)
              .toNumber();
      latterTotal += amount;

      return {
        billId,
        memberId: v.id,
        amount: data.type === 'expense' ? amount * -1 : amount,
      };
    });

    const formerRemainder = data.amount - formerTotal;
    const latterRemainder = data.amount - latterTotal;

    const updatedFormer = former.map((v) =>
      v.memberId !== data.formerRemainder
        ? v
        : {
            ...v,
            amount:
              v.amount > 0
                ? v.amount + formerRemainder
                : v.amount - formerRemainder,
          }
    );
    const updatedLatter = latter.map((v) =>
      v.memberId !== data.latterRemainder
        ? v
        : {
            ...v,
            amount:
              v.amount > 0
                ? v.amount + latterRemainder
                : v.amount - latterRemainder,
          }
    );

    return [...updatedFormer, ...updatedLatter];
  }

  public async addBill(
    id: string,
    data: PostBookBillRequest,
    headers: AuthHeaders
  ) {
    await this.validateBook(id, headers['x-api-code']);

    try {
      await this.dbAccess.startTransaction();

      const bill = new BillEntity();
      bill.ver = 1;
      bill.bookId = id;
      bill.date = new Date(data.date);
      bill.descr = data.descr;
      bill.memo = data.memo ?? null;

      const newBill = await this.billAccess.save(bill);
      const { formerAmount, latterAmount } = this.validateBill(data);
      const share = this.getShare(data, formerAmount, latterAmount, newBill.id);

      await Promise.all(
        share.map(async (v) => {
          const billShare = new BillShareEntity();
          billShare.ver = 1;
          billShare.billId = v.billId;
          billShare.memberId = v.memberId;
          billShare.amount = v.amount;

          await this.billShareAccess.save(billShare);
        })
      );

      await this.dbAccess.commitTransaction();
    } catch (e) {
      await this.dbAccess.rollbackTransaction();
      throw e;
    }
  }

  public async updateBill(
    bid: string,
    billId: string,
    data: PutBookBillRequest,
    headers: AuthHeaders
  ) {
    await this.validateBook(bid, headers['x-api-code']);

    try {
      await this.dbAccess.startTransaction();
      const oldBill = await this.billAccess.findUndeletedById(billId);

      await this.billAccess.update({
        ...oldBill,
        dateDeleted: new Date(),
      });

      const bill = new BillEntity();
      bill.id = billId;
      bill.ver = bn(oldBill.ver).plus(1).toNumber();
      bill.bookId = bid;
      bill.date = new Date(data.date);
      bill.descr = data.descr;
      bill.memo = data.memo ?? null;

      await this.billAccess.save(bill);

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

      const { formerAmount, latterAmount } = this.validateBill(data);
      const share = this.getShare(data, formerAmount, latterAmount, billId);

      await Promise.all(
        share.map(async (v) => {
          const billShare = new BillShareEntity();
          billShare.billId = v.billId;
          billShare.ver = bn(oldBill.ver).plus(1).toNumber();
          billShare.memberId = v.memberId;
          billShare.amount = v.amount;

          await this.billShareAccess.save(billShare);
        })
      );

      await this.dbAccess.commitTransaction();
    } catch (e) {
      await this.dbAccess.rollbackTransaction();
      throw e;
    }
  }

  public async addTransfer(
    id: string,
    data: PostBookTransferRequest,
    headers: AuthHeaders
  ) {
    await this.validateBook(id, headers['x-api-code']);

    const transfer = new TransferEntity();
    transfer.ver = 1;
    transfer.bookId = id;
    transfer.date = new Date(data.date);
    transfer.amount = data.amount;
    transfer.srcMemberId = data.srcMemberId;
    transfer.dstMemberId = data.dstMemberId;
    transfer.memo = data.memo ?? null;

    await this.transferAccess.save(transfer);
  }

  public async updateTransfer(
    bid: string,
    tid: string,
    data: PostBookTransferRequest,
    headers: AuthHeaders
  ) {
    await this.validateBook(bid, headers['x-api-code']);

    try {
      await this.dbAccess.startTransaction();
      const oldTransfer = await this.transferAccess.findUndeletedById(tid);

      await this.transferAccess.update({
        ...oldTransfer,
        dateDeleted: new Date(),
      });

      const newTransfer = new TransferEntity();
      newTransfer.id = tid;
      newTransfer.ver = bn(oldTransfer.ver).plus(1).toNumber();
      newTransfer.bookId = bid;
      newTransfer.date = new Date(data.date);
      newTransfer.amount = data.amount;
      newTransfer.srcMemberId = data.srcMemberId;
      newTransfer.dstMemberId = data.dstMemberId;
      newTransfer.memo = data.memo ?? null;

      await this.transferAccess.save(newTransfer);

      await this.dbAccess.commitTransaction();
    } catch (e) {
      await this.dbAccess.rollbackTransaction();
      throw e;
    }
  }

  public async deleteTransfer(bid: string, tid: string, headers: AuthHeaders) {
    await this.validateBook(bid, headers['x-api-code']);

    const transfer = await this.transferAccess.findUndeletedById(tid);

    await this.transferAccess.update({
      ...transfer,
      dateDeleted: new Date(),
    });
  }
}
