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
}
