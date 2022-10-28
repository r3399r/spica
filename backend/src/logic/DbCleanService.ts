import { inject, injectable } from 'inversify';
import { BillAccess } from 'src/access/BillAccess';
import { BillShareAccess } from 'src/access/BillShareAccess';
import { BookAccess } from 'src/access/BookAccess';
import { DbAccess } from 'src/access/DbAccess';
import { MemberAccess } from 'src/access/MemberAccess';
import { TransferAccess } from 'src/access/TransferAccess';
import { ViewLastUpdateAccess } from 'src/access/ViewLastUpdateAccess';

/**
 * Service class for DbClean
 */
@injectable()
export class DbCleanService {
  @inject(DbAccess)
  private readonly dbAccess!: DbAccess;

  @inject(ViewLastUpdateAccess)
  private readonly vLastUpdateAccess!: ViewLastUpdateAccess;

  @inject(TransferAccess)
  private readonly transferAccess!: TransferAccess;

  @inject(BillAccess)
  private readonly billAccess!: BillAccess;

  @inject(BillShareAccess)
  private readonly billShareAccess!: BillShareAccess;

  @inject(MemberAccess)
  private readonly memberAccess!: MemberAccess;

  @inject(BookAccess)
  private readonly bookAccess!: BookAccess;

  public async cleanup() {
    await this.dbAccess.cleanup();
  }

  public async cleanExpiredBook() {
    try {
      await this.dbAccess.startTransaction();
      const res = await this.vLastUpdateAccess.findAll();

      for (const book of res)
        if (
          new Date().getTime() - book.dateLastUpdate.getTime() >
          90 * 24 * 60 * 60 * 1000 // 90 days
        ) {
          // delete transfer
          await this.transferAccess.hardDeleteByBookId(book.id);

          // delete bill -> billShare
          const bills = await this.billAccess.findByBookId(book.id);
          for (const bill of bills)
            await this.billShareAccess.hardDeleteByBillId(bill.id);
          await this.billAccess.hardDeleteByBookId(book.id);

          // delete member
          await this.memberAccess.hardDeleteByBookId(book.id);

          // delete book
          await this.bookAccess.hardDeleteById(book.id);
        }
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
