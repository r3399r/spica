import { inject, injectable } from 'inversify';
import { BillAccess } from 'src/access/BillAccess';
import { BillShareAccess } from 'src/access/BillShareAccess';
import { BookAccess } from 'src/access/BookAccess';
import { CurrencyAccess } from 'src/access/CurrencyAccess';
import { DbAccess } from 'src/access/DbAccess';
import { DeviceBookAccess } from 'src/access/DeviceBookAccess';
import { DeviceTokenAccess } from 'src/access/DeviceTokenAccess';
import { MemberAccess } from 'src/access/MemberAccess';
import { MemberSettlementAccess } from 'src/access/MemberSettlementAccess';
import { TransferAccess } from 'src/access/TransferAccess';
import { ViewBookAccess } from 'src/access/ViewBookAccess';

/**
 * Service class for DbClean
 */
@injectable()
export class DbCleanService {
  @inject(DbAccess)
  private readonly dbAccess!: DbAccess;

  @inject(ViewBookAccess)
  private readonly vBookAccess!: ViewBookAccess;

  @inject(TransferAccess)
  private readonly transferAccess!: TransferAccess;

  @inject(BillAccess)
  private readonly billAccess!: BillAccess;

  @inject(BillShareAccess)
  private readonly billShareAccess!: BillShareAccess;

  @inject(MemberAccess)
  private readonly memberAccess!: MemberAccess;

  @inject(MemberSettlementAccess)
  private readonly memberSettlementAccess!: MemberSettlementAccess;

  @inject(CurrencyAccess)
  private readonly currencyAccess!: CurrencyAccess;

  @inject(BookAccess)
  private readonly bookAccess!: BookAccess;

  @inject(DeviceBookAccess)
  private readonly deviceBookAccess!: DeviceBookAccess;

  @inject(DeviceTokenAccess)
  private readonly deviceTokenAccess!: DeviceTokenAccess;

  public async cleanup() {
    await this.dbAccess.cleanup();
  }

  private async cleanExpiredBook() {
    const res = await this.vBookAccess.findExpired();

    for (const book of res) {
      // delete member_settlement
      const settles = await this.memberSettlementAccess.find({
        where: { currency: { bookId: book.id } },
      });
      for (const settle of settles)
        await this.memberSettlementAccess.hardDeleteById(settle.id);

      // delete transfer
      await this.transferAccess.hardDeleteByBookId(book.id);

      // delete bill -> billShare
      const bills = await this.billAccess.findByBookId(book.id);
      for (const bill of bills)
        await this.billShareAccess.hardDeleteByBillId(bill.id);
      await this.billAccess.hardDeleteByBookId(book.id);

      // delete currency
      await this.currencyAccess.hardDeleteByBookId(book.id);

      // delete member
      await this.memberAccess.hardDeleteByBookId(book.id);

      // delete device book pair
      await this.deviceBookAccess.hardDeleteByBookId(book.id);

      // delete book
      await this.bookAccess.hardDeleteById(book.id);
    }
  }

  private async cleanExpiredToken() {
    const res = await this.deviceTokenAccess.findExpired();

    for (const deviceToken of res)
      await this.deviceTokenAccess.hardDeleteById(deviceToken.id);
  }

  public async cleanExpired() {
    try {
      await this.dbAccess.startTransaction();

      await this.cleanExpiredBook();
      await this.cleanExpiredToken();

      await this.dbAccess.commitTransaction();
    } catch (e) {
      await this.dbAccess.rollbackTransaction();
      throw e;
    }
  }

  public async resetSqlStats() {
    await this.dbAccess.resetSqlStats();
  }
}
