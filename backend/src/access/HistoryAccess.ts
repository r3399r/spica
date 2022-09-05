import { inject, injectable } from 'inversify';
import { History } from 'src/model/entity/History';
import { HistoryEntity } from 'src/model/entity/HistoryEntity';
import { Database } from 'src/util/Database';

/**
 * Access class for History model.
 */
@injectable()
export class HistoryAccess {
  @inject(Database)
  private readonly database!: Database;

  public async save(input: History) {
    const qr = await this.database.getQueryRunner();
    const entity = new HistoryEntity();
    Object.assign(entity, input);

    return await qr.manager.save(entity);
  }
}
