import { inject, injectable } from 'inversify';
import { Transfer } from 'src/model/entity/Transfer';
import { TransferEntity } from 'src/model/entity/TransferEntity';
import { Database } from 'src/util/Database';

/**
 * Access class for Transfer model.
 */
@injectable()
export class TransferAccess {
  @inject(Database)
  private readonly database!: Database;

  public async save(input: Transfer) {
    const qr = await this.database.getQueryRunner();
    const entity = new TransferEntity();
    Object.assign(entity, input);

    return await qr.manager.save(entity);
  }
}
