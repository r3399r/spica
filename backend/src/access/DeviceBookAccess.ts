import { inject, injectable } from 'inversify';
import { DeviceBook } from 'src/model/entity/DeviceBook';
import { DeviceBookEntity } from 'src/model/entity/DeviceBookEntity';
import { Database } from 'src/util/Database';

/**
 * Access class for DeviceBook model.
 */
@injectable()
export class DeviceBookAccess {
  @inject(Database)
  private readonly database!: Database;

  public async save(input: DeviceBook) {
    const qr = await this.database.getQueryRunner();
    const entity = new DeviceBookEntity();
    Object.assign(entity, input);

    return await qr.manager.save(entity);
  }

  public async hardDeleteByBookId(id: string) {
    const qr = await this.database.getQueryRunner();

    await qr.manager.delete(DeviceBookEntity.name, { bookId: id });
  }
}
