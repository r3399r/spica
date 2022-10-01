import { inject, injectable } from 'inversify';
import { ViewTransaction } from 'src/model/viewEntity/ViewTransaction';
import { ViewTransactionEntity } from 'src/model/viewEntity/ViewTransactionEntity';
import { Database } from 'src/util/Database';

/**
 * Access class for ViewTransaction model.
 */
@injectable()
export class ViewTransactionAccess {
  @inject(Database)
  private readonly database!: Database;

  public async findByBookId(bookId: string) {
    const qr = await this.database.getQueryRunner();

    return await qr.manager.find<ViewTransaction>(ViewTransactionEntity.name, {
      where: { bookId },
      order: { date: 'DESC' },
    });
  }
}
