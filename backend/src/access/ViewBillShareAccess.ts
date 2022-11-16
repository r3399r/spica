import { inject, injectable } from 'inversify';
import { ViewBillShare } from 'src/model/viewEntity/ViewBillShare';
import { ViewBillShareEntity } from 'src/model/viewEntity/ViewBillShareEntity';
import { Database } from 'src/util/Database';

/**
 * Access class for ViewBillShare model.
 */
@injectable()
export class ViewBillShareAccess {
  @inject(Database)
  private readonly database!: Database;

  public async findByBookId(bookId: string) {
    const qr = await this.database.getQueryRunner();

    return await qr.manager.find<ViewBillShare>(ViewBillShareEntity.name, {
      where: { bookId },
      order: { ver: 'ASC' },
    });
  }

  public async findByBillId(billId: string) {
    const qr = await this.database.getQueryRunner();

    return await qr.manager.find<ViewBillShare>(ViewBillShareEntity.name, {
      where: { billId },
      order: { ver: 'ASC' },
    });
  }
}
