import { inject, injectable } from 'inversify';
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

  public async hardDeleteByBillId(id: string) {
    const qr = await this.database.getQueryRunner();

    await qr.manager.delete(BillShareEntity.name, { billId: id });

    // if (res.affected === 0) throw new BadRequestError('nothing happened.');
  }
}
