import { BadRequestError, UnauthorizedError } from '@y-celestial/service';
import { BigNumber } from 'bignumber.js';
import { inject, injectable } from 'inversify';
import { BillAccess } from 'src/access/BillAccess';
import { BillShareAccess } from 'src/access/BillShareAccess';
import { BookAccess } from 'src/access/BookAccess';
import { DbAccess } from 'src/access/DbAccess';
import { MemberAccess } from 'src/access/MemberAccess';
import { TransferAccess } from 'src/access/TransferAccess';
import { ViewTransactionAccess } from 'src/access/ViewTransactionAccess';
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
            type: v.type,
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
            shareMemberId: v.shareMemberId,
            shareCount: v.shareCount,
            memo: v.memo,
            dateCreated: v.dateCreated,
            dateUpdated: v.dateUpdated,
            dateDeleted: v.dateDeleted,
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
    if (!BigNumber.sum(...data.map((v) => v.amount)).eq(0))
      throw new BadRequestError('sum should be 0');

    if (
      !BigNumber.sum(
        ...data.filter((v) => v.amount > 0).map((v) => v.amount)
      ).eq(amount)
    )
      throw new BadRequestError('positive sum not consistent');

    if (
      !BigNumber.sum(...data.filter((v) => v.amount < 0).map((v) => v.amount))
        .negated()
        .eq(amount)
    )
      throw new BadRequestError('negative sum not consistent');
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
      bill.date = new Date(data.date);
      bill.type = data.type;
      bill.descr = data.descr;
      bill.amount = data.amount;
      bill.memo = data.memo ?? null;

      const newBill = await this.billAccess.save(bill);
      this.validateDetail(data.amount, data.detail);

      const former = data.detail.filter((v) => v.amount > 0);
      const latter = data.detail.filter((v) => v.amount < 0);

      const resFormer = await Promise.all(
        former.map(async (v) => {
          const billShare = new BillShareEntity();
          billShare.billId = newBill.id;
          billShare.ver = '1';
          billShare.memberId = v.id;
          billShare.amount = v.amount;

          await this.billShareAccess.save(billShare);

          return await this.updateMember(v.id, v.amount);
        })
      );
      const resLatter = await Promise.all(
        latter.map(async (v) => {
          const billShare = new BillShareEntity();
          billShare.billId = newBill.id;
          billShare.ver = '1';
          billShare.memberId = v.id;
          billShare.amount = v.amount;

          await this.billShareAccess.save(billShare);

          return await this.updateMember(v.id, v.amount, true);
        })
      );

      await this.dbAccess.commitTransaction();

      return {
        members: [...resFormer, ...resLatter],
        transaction: {
          ...newBill,
          shareMemberId: former[0].id,
          shareCount: former.length.toString(),
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
      dateDeleted: new Date(),
    });

    const oldBillShares = await this.billShareAccess.findByBill(
      oldBill.id,
      oldBill.ver
    );

    const former = oldBillShares.filter((v) => v.amount > 0);
    const latter = oldBillShares.filter((v) => v.amount < 0);
    await Promise.all(
      former.map((v) => this.updateMember(v.memberId, bn(v.amount).negated()))
    );
    await Promise.all(
      latter.map((v) =>
        this.updateMember(v.memberId, bn(v.amount).negated(), true)
      )
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
      this.validateDetail(data.amount, data.detail);

      const former = data.detail.filter((v) => v.amount > 0);
      const latter = data.detail.filter((v) => v.amount < 0);

      const resFormer = await Promise.all(
        former.map(async (v) => {
          const billShare = new BillShareEntity();
          billShare.billId = newBill.id;
          billShare.ver = bn(oldBill.ver).plus(1).toString();
          billShare.memberId = v.id;
          billShare.amount = v.amount;

          await this.billShareAccess.save(billShare);

          return await this.updateMember(v.id, v.amount);
        })
      );
      const resLatter = await Promise.all(
        latter.map(async (v) => {
          const billShare = new BillShareEntity();
          billShare.billId = newBill.id;
          billShare.ver = bn(oldBill.ver).plus(1).toString();
          billShare.memberId = v.id;
          billShare.amount = v.amount;

          await this.billShareAccess.save(billShare);

          return await this.updateMember(v.id, v.amount, true);
        })
      );

      await this.dbAccess.commitTransaction();

      return {
        members: [...resFormer, ...resLatter],
        transaction: {
          ...newBill,
          shareMemberId: former[0].id,
          shareCount: former.length.toString(),
        },
      };
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

      const member1 = await this.updateMember(
        data.srcMemberId,
        bn(data.amount)
      );
      const member2 = await this.updateMember(
        data.dstMemberId,
        bn(data.amount).negated()
      );
      const res = await this.transferAccess.save(transfer);

      await this.dbAccess.commitTransaction();

      return {
        members: [member1, member2],
        transaction: {
          ...res,
          type: 'transfer',
        },
      };
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
      await this.updateMember(
        oldTransfer.srcMemberId,
        bn(oldTransfer.amount).negated()
      );
      await this.updateMember(oldTransfer.dstMemberId, bn(oldTransfer.amount));

      const newTransfer = new TransferEntity();
      newTransfer.id = tid;
      newTransfer.ver = bn(oldTransfer.ver).plus(1).toString();
      newTransfer.bookId = bid;
      newTransfer.date = new Date(data.date);
      newTransfer.amount = data.amount;
      newTransfer.srcMemberId = data.srcMemberId;
      newTransfer.dstMemberId = data.dstMemberId;
      newTransfer.memo = data.memo ?? null;

      const member1 = await this.updateMember(
        data.srcMemberId,
        bn(data.amount)
      );
      const member2 = await this.updateMember(
        data.dstMemberId,
        bn(data.amount).negated()
      );
      const res = await this.transferAccess.save(newTransfer);

      await this.dbAccess.commitTransaction();

      return {
        members: [member1, member2],
        transaction: {
          ...res,
          type: 'transfer',
        },
      };
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

      await this.updateMember(
        transfer.srcMemberId,
        bn(transfer.amount).negated()
      );
      await this.updateMember(transfer.dstMemberId, bn(transfer.amount));
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
