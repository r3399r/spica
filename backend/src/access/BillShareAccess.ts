import { BadRequestError } from '@y-celestial/service';
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

  public async findByBill(billId: string, ver: number) {
    const qr = await this.database.getQueryRunner();

    return await qr.manager.findBy<BillShare>(BillShareEntity.name, {
      billId,
      ver,
    });
  }

  public async update(input: BillShare) {
    const qr = await this.database.getQueryRunner();
    const entity = new BillShareEntity();
    Object.assign(entity, input);

    const res = await qr.manager.update(
      BillShareEntity,
      { id: input.id, ver: input.ver },
      entity
    );

    if (res.affected === 0) throw new BadRequestError('nothing happened.');
  }
}
