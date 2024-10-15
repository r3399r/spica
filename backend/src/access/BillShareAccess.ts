import { inject, injectable } from 'inversify';
import { ObjectLiteral } from 'typeorm';
import { BillShare } from 'src/model/entity/BillShare';
import { BillShareEntity } from 'src/model/entity/BillShareEntity';
import { Database } from 'src/util/Database';

/**
 * Access class for BillShare model.
 */
@injectable()
export class BillShareAccess {
  @inject(Database)
  private readonly database!: Database;

  public async save(input: BillShare) {
    const qr = await this.database.getQueryRunner();
    const entity = new BillShareEntity();
    Object.assign(entity, input);

    return await qr.manager.save(entity);
  }

  public async findByBill(billId: string, ver: string) {
    const qr = await this.database.getQueryRunner();

    return await qr.manager.findBy<BillShare>(BillShareEntity.name, {
      billId,
      ver,
    });
  }

  private async executeDelete(where: string, parameters?: ObjectLiteral) {
    const qb = await this.database.getQueryBuilder();
    await qb
      .delete()
      .from(BillShareEntity.name)
      .where(where, parameters)
      .execute();
  }

  public async hardDeleteByBillIds(ids: string[]) {
    await this.executeDelete('bill_id IN (:...ids)', { ids });
  }
}
