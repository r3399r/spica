import { inject, injectable } from 'inversify';
import { FindManyOptions } from 'typeorm';
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

  public async findAndCountByBookId(
    bookId: string,
    findManyOptions?: FindManyOptions<ViewTransaction>
  ) {
    const qr = await this.database.getQueryRunner();

    const res = await qr.manager.findAndCount<ViewTransaction>(
      ViewTransactionEntity.name,
      {
        ...findManyOptions,
        where: { bookId },
      }
    );

    return { data: res[0], count: res[1] };
  }
}
