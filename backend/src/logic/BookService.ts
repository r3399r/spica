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
import { BillShareType, BillType } from 'src/constant/Book';
import {
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
import { TransferEntity } from 'src/model/entity/TransferEntity';
import { ShareDetail } from 'src/model/type/Book';
import {
  ViewTransactionBill,
  ViewTransactionTransfer,
} from 'src/model/viewEntity/ViewTransaction';
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
    book.code = randomBase10(6);

    return await this.bookAccess.save(book);
  }

  private async validateBook(id: string, code: string) {
    const book = await this.bookAccess.findById(id);
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

    const books = await this.bookAccess.findByIds(idArray);

    return books.filter((v) => {
      const idx = idArray.findIndex((id) => id === v.id);
      if (idx === -1 || codeArray[idx] !== v.code) return false;

      return true;
    });
  }

  public async getBookNameById(id: string): Promise<GetBookNameResponse> {
    const book = await this.bookAccess.findById(id);

    return { id: book.id, name: book.name };
  }

  public async getBookDetail(
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
            type: v.type as BillType,
            descr: v.descr,
            amount: v.amount,
            memo: v.memo,
            dateCreated: v.dateCreated,
            dateUpdated: v.dateUpdated,
            dateDeleted: v.dateDeleted,
            detail: billShares
              .filter((o) => o.billId === v.id && o.ver === v.ver)
              .map((o) => {
                const {
                  bookId: ignoredBookId,
                  billId: ignoredBillId,
                  ver: ignoredVer,
                  ...rest
                } = o;

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

  private splitDetail(amount: number, data: ShareDetail[]) {
    const memberWeight = data.filter((v) => v.type === BillShareType.Weight);
    const memberAmount = data.filter((v) => v.type === BillShareType.Amount);
    const memberPct = data.filter((v) => v.type === BillShareType.Pct);

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
    const splitAmount = memberAmount.map((v) => {
      inputTotal = inputTotal.plus(v.value);

      return {
        id: v.id,
        type: v.type,
        value: v.value,
        amount: bn(v.value),
      };
    });
    const splitPct = memberPct.map((v) => {
      const splited = bn(amount).times(v.value).div(100).dp(2);
      inputTotal = inputTotal.plus(splited);

      return {
        id: v.id,
        type: v.type,
        value: v.value,
        amount: splited,
      };
    });

    if (inputTotal.gt(amount))
      throw new BadRequestError('input total exceeds amount');
    if (inputTotal.lt(amount) && memberWeight.length === 0)
      throw new BadRequestError('may need someone to take the rest amount');

    const restAmount = bn(amount).minus(inputTotal);
    const totalWeights = BigNumber.sum(...memberWeight.map((v) => bn(v.value)));

    let weightTotal = bn(0);
    const splitedWeight = memberWeight.map((v) => {
      const splited = restAmount.times(v.value).div(totalWeights).dp(2);
      weightTotal = weightTotal.plus(splited);

      return { id: v.id, type: v.type, value: v.value, amount: splited };
    });

    const remainder = restAmount.minus(weightTotal);
    const takeRemainder = data.find((v) => v.takeRemainder === true);
    if (!remainder.eq(0) && numTakeRemainder === 0)
      throw new BadRequestError('no one takes the remainder');

    const splitCombined = [...splitAmount, ...splitPct, ...splitedWeight];

    return splitCombined.map((v) => ({
      ...v,
      amount: takeRemainder?.id === v.id ? v.amount.plus(remainder) : v.amount,
      takeRemainder: takeRemainder?.id === v.id,
    }));
  }

  private async updateMemberBalance(id: string, amount: number | BigNumber) {
    const oldMember = await this.memberAccess.findById(id);
    const newMember: Member = {
      ...oldMember,
      balance: bn(oldMember.balance).plus(amount).toNumber(),
      deletable: false,
    };
    await this.memberAccess.update(newMember);
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
      const splitFormer = this.splitDetail(data.amount, data.former);
      const splitLatter = this.splitDetail(data.amount, data.latter);

      const detailFormer = await Promise.all(
        splitFormer.map(async (v) => {
          const billShare = new BillShareEntity();
          billShare.billId = newBill.id;
          billShare.ver = '1';
          billShare.memberId = v.id;
          billShare.side = 'former';
          billShare.type = v.type;
          billShare.value = v.value;
          billShare.takeRemainder = v.takeRemainder;

          await this.updateMemberBalance(
            v.id,
            data.type === BillType.Expense ? v.amount : v.amount.negated()
          );
          const newBillShare = await this.billShareAccess.save(billShare);
          const {
            billId: ignoredBillId,
            ver: ignoredVer,
            ...rest
          } = newBillShare;

          return rest;
        })
      );
      const detailLatter = await Promise.all(
        splitLatter.map(async (v) => {
          const billShare = new BillShareEntity();
          billShare.billId = newBill.id;
          billShare.ver = '1';
          billShare.memberId = v.id;
          billShare.side = 'latter';
          billShare.type = v.type;
          billShare.value = v.value;
          billShare.takeRemainder = v.takeRemainder;

          await this.updateMemberBalance(
            v.id,
            data.type === BillType.Expense ? v.amount.negated() : v.amount
          );
          const newBillShare = await this.billShareAccess.save(billShare);
          const {
            billId: ignoredBillId,
            ver: ignoredVer,
            ...rest
          } = newBillShare;

          return rest;
        })
      );

      await this.dbAccess.commitTransaction();

      return { ...newBill, detail: [...detailFormer, ...detailLatter] };
    } catch (e) {
      await this.dbAccess.rollbackTransaction();
      throw e;
    }
  }

  private async deleteOldBill(oldBill: Bill) {
    await this.billAccess.update({
      ...oldBill,
      dateDeleted: new Date(),
    });

    const oldBillShares = await this.billShareAccess.findByBill(
      oldBill.id,
      oldBill.ver
    );

    const oldFormer: ShareDetail[] = [];
    const oldLatter: ShareDetail[] = [];
    oldBillShares.forEach((v) => {
      if (v.side === 'former')
        oldFormer.push({
          id: v.memberId,
          type: v.type,
          value: v.value,
          takeRemainder: v.takeRemainder,
        });
      else
        oldLatter.push({
          id: v.memberId,
          type: v.type,
          value: v.value,
          takeRemainder: v.takeRemainder,
        });
    });

    const oldSpiltFormer = this.splitDetail(oldBill.amount, oldFormer);
    const oldSpiltLatter = this.splitDetail(oldBill.amount, oldLatter);

    await Promise.all(
      oldSpiltFormer.map(async (v) => {
        await this.updateMemberBalance(
          v.id,
          oldBill.type === BillType.Expense ? v.amount.negated() : v.amount
        );
      })
    );
    await Promise.all(
      oldSpiltLatter.map(async (v) => {
        await this.updateMemberBalance(
          v.id,
          oldBill.type === BillType.Expense ? v.amount : v.amount.negated()
        );
      })
    );
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
      await this.deleteOldBill(oldBill);

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
      const splitFormer = this.splitDetail(data.amount, data.former);
      const splitLatter = this.splitDetail(data.amount, data.latter);

      const detailFormer = await Promise.all(
        splitFormer.map(async (v) => {
          const billShare = new BillShareEntity();
          billShare.billId = billId;
          billShare.ver = bn(oldBill.ver).plus(1).toString();
          billShare.memberId = v.id;
          billShare.side = 'former';
          billShare.type = v.type;
          billShare.value = v.value;
          billShare.takeRemainder = v.takeRemainder;

          await this.updateMemberBalance(
            v.id,
            data.type === BillType.Expense ? v.amount : v.amount.negated()
          );
          const newBillShare = await this.billShareAccess.save(billShare);
          const {
            billId: ignoredBillId,
            ver: ignoredVer,
            ...rest
          } = newBillShare;

          return rest;
        })
      );
      const detailLatter = await Promise.all(
        splitLatter.map(async (v) => {
          const billShare = new BillShareEntity();
          billShare.billId = billId;
          billShare.ver = bn(oldBill.ver).plus(1).toString();
          billShare.memberId = v.id;
          billShare.side = 'latter';
          billShare.type = v.type;
          billShare.value = v.value;
          billShare.takeRemainder = v.takeRemainder;

          await this.updateMemberBalance(
            v.id,
            data.type === BillType.Expense ? v.amount.negated() : v.amount
          );
          const newBillShare = await this.billShareAccess.save(billShare);
          const {
            billId: ignoredBillId,
            ver: ignoredVer,
            ...rest
          } = newBillShare;

          return rest;
        })
      );

      await this.dbAccess.commitTransaction();

      return { ...newBill, detail: [...detailFormer, ...detailLatter] };
    } catch (e) {
      await this.dbAccess.rollbackTransaction();
      throw e;
    }
  }

  public async deleteBill(bid: string, billId: string, code: string) {
    await this.validateBook(bid, code);

    try {
      await this.dbAccess.startTransaction();
      const bill = await this.billAccess.findUndeletedById(billId);
      await this.deleteOldBill(bill);

      await this.dbAccess.commitTransaction();
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
      transfer.date = new Date(data.date);
      transfer.amount = data.amount;
      transfer.srcMemberId = data.srcMemberId;
      transfer.dstMemberId = data.dstMemberId;
      transfer.memo = data.memo ?? null;

      await this.updateMemberBalance(data.srcMemberId, bn(data.amount));
      await this.updateMemberBalance(
        data.dstMemberId,
        bn(data.amount).negated()
      );
      const res = await this.transferAccess.save(transfer);

      await this.dbAccess.commitTransaction();

      return res;
    } catch (e) {
      await this.dbAccess.rollbackTransaction();
      throw e;
    }
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
      await this.updateMemberBalance(
        oldTransfer.srcMemberId,
        bn(oldTransfer.amount).negated()
      );
      await this.updateMemberBalance(
        oldTransfer.dstMemberId,
        bn(oldTransfer.amount)
      );

      const newTransfer = new TransferEntity();
      newTransfer.id = tid;
      newTransfer.ver = bn(oldTransfer.ver).plus(1).toString();
      newTransfer.bookId = bid;
      newTransfer.date = new Date(data.date);
      newTransfer.amount = data.amount;
      newTransfer.srcMemberId = data.srcMemberId;
      newTransfer.dstMemberId = data.dstMemberId;
      newTransfer.memo = data.memo ?? null;

      await this.updateMemberBalance(data.srcMemberId, bn(data.amount));
      await this.updateMemberBalance(
        data.dstMemberId,
        bn(data.amount).negated()
      );
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

    try {
      await this.dbAccess.startTransaction();
      const transfer = await this.transferAccess.findUndeletedById(tid);

      await this.updateMemberBalance(
        transfer.srcMemberId,
        bn(transfer.amount).negated()
      );
      await this.updateMemberBalance(transfer.dstMemberId, bn(transfer.amount));
      await this.transferAccess.update({
        ...transfer,
        dateDeleted: new Date(),
      });

      await this.dbAccess.commitTransaction();
    } catch (e) {
      await this.dbAccess.rollbackTransaction();
      throw e;
    }
  }
}
