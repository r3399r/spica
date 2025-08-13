import { inject, injectable } from 'inversify';
import { FindManyOptions, In } from 'typeorm';
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

  public async find(options?: FindManyOptions<ViewBillShare>) {
    const qr = await this.database.getQueryRunner();

    return await qr.manager.find<ViewBillShare>(ViewBillShareEntity.name, {
      ...options,
    });
  }

  public async findByBillIds(ids: string[]) {
    return await this.find({
      where: { billId: In(ids) },
      order: { ver: 'ASC' },
    });
  }

  public async findByBillId(billId: string) {
    return await this.find({
      where: { billId },
      order: { ver: 'ASC' },
    });
  }
}
