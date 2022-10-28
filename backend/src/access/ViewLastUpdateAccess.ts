import { inject, injectable } from 'inversify';
import { ViewLastUpdate } from 'src/model/viewEntity/ViewLastUpdate';
import { ViewLastUpdateEntity } from 'src/model/viewEntity/ViewLastUpdateEntity';
import { Database } from 'src/util/Database';

/**
 * Access class for ViewLastUpdate model.
 */
@injectable()
export class ViewLastUpdateAccess {
  @inject(Database)
  private readonly database!: Database;

  public async findAll() {
    const qr = await this.database.getQueryRunner();

    return await qr.manager.find<ViewLastUpdate>(ViewLastUpdateEntity.name);
  }
}
