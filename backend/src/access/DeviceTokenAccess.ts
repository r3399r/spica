import { inject, injectable } from 'inversify';
import { Raw } from 'typeorm';
import { DeviceToken } from 'src/model/entity/DeviceToken';
import { DeviceTokenEntity } from 'src/model/entity/DeviceTokenEntity';
import { InternalServerError } from 'src/model/error';
import { Database } from 'src/util/Database';

/**
 * Access class for DeviceToken model.
 */
@injectable()
export class DeviceTokenAccess {
  @inject(Database)
  private readonly database!: Database;

  public async save(input: DeviceToken) {
    const qr = await this.database.getQueryRunner();
    const entity = new DeviceTokenEntity();
    Object.assign(entity, input);

    return await qr.manager.save(entity);
  }

  public async hardDeleteById(id: string) {
    const qr = await this.database.getQueryRunner();

    const res = await qr.manager.delete(DeviceTokenEntity.name, id);

    if (res.affected === 0) throw new InternalServerError('nothing happened.');
  }

  public async findByDeviceId(deviceId: string) {
    const qr = await this.database.getQueryRunner();

    return await qr.manager.findOne<DeviceToken>(DeviceTokenEntity.name, {
      where: {
        deviceId,
        dateExpired: Raw((alias) => `${alias} > NOW()`),
      },
    });
  }

  public async findByToken(token: string) {
    const qr = await this.database.getQueryRunner();

    return await qr.manager.findOne<DeviceToken>(DeviceTokenEntity.name, {
      where: {
        token,
        dateExpired: Raw((alias) => `${alias} > NOW()`),
      },
    });
  }

  public async findExpired() {
    const qr = await this.database.getQueryRunner();

    return await qr.manager.find<DeviceToken>(DeviceTokenEntity.name, {
      where: {
        dateExpired: Raw((alias) => `${alias} < NOW()`),
      },
    });
  }
}
