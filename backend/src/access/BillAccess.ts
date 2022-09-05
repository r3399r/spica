import { inject, injectable } from 'inversify';
import { Bill } from 'src/model/entity/Bill';
import { BillEntity } from 'src/model/entity/BillEntity';
import { Database } from 'src/util/Database';

/**
 * Access class for Bill model.
 */
@injectable()
export class BillAccess {
  @inject(Database)
  private readonly database!: Database;

  public async save(input: Bill) {
    const qr = await this.database.getQueryRunner();
    const entity = new BillEntity();
    Object.assign(entity, input);

    return await qr.manager.save(entity);
  }
}
