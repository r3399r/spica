import { inject, injectable } from 'inversify';
import { ViewDeviceBook } from 'src/model/viewEntity/ViewDeviceBook';
import { ViewDeviceBookEntity } from 'src/model/viewEntity/ViewDeviceBookEntity';
import { Database } from 'src/util/Database';

/**
 * Access class for ViewDeviceBook model.
 */
@injectable()
export class ViewDeviceBookAccess {
  @inject(Database)
  private readonly database!: Database;

  public async findByDeviceId(deviceId: string) {
    const qr = await this.database.getQueryRunner();

    return await qr.manager.find<ViewDeviceBook>(ViewDeviceBookEntity.name, {
      where: { deviceId },
    });
  }
}
