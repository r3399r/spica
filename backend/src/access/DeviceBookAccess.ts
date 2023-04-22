import { inject, injectable } from 'inversify';
import { DeviceBook } from 'src/model/entity/DeviceBook';
import { DeviceBookEntity } from 'src/model/entity/DeviceBookEntity';
import { BadRequestError } from 'src/model/error';
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

  public async update(input: DeviceBook) {
    const qr = await this.database.getQueryRunner();
    const entity = new DeviceBookEntity();
    Object.assign(entity, input);

    const res = await qr.manager.update(DeviceBookEntity, input.id, entity);

    if (res.affected === 0) throw new BadRequestError('nothing happened.');
  }

  public async hardDeleteByDeviceIdAndBookId(deviceId: string, bookId: string) {
    const qr = await this.database.getQueryRunner();

    await qr.manager.delete(DeviceBookEntity.name, { deviceId, bookId });
  }

  public async hardDeleteByBookId(bookId: string) {
    const qr = await this.database.getQueryRunner();

    await qr.manager.delete(DeviceBookEntity.name, { bookId });
  }

  public async findByDeviceId(deviceId: string) {
    const qr = await this.database.getQueryRunner();

    return await qr.manager.find<DeviceBook>(DeviceBookEntity.name, {
      where: { deviceId },
    });
  }

  public async findByDeviceIdAndBookId(deviceId: string, bookId: string) {
    const qr = await this.database.getQueryRunner();

    return await qr.manager.findOne<DeviceBook>(DeviceBookEntity.name, {
      where: { deviceId, bookId },
    });
  }
}
