import { inject, injectable } from 'inversify';
import { FindManyOptions, Raw } from 'typeorm';
import { DeviceToken } from 'src/model/entity/DeviceToken';
import { DeviceTokenEntity } from 'src/model/entity/DeviceTokenEntity';
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

  public async hardDelete(options: FindManyOptions<DeviceToken>) {
    const qr = await this.database.getQueryRunner();
    const res = await qr.manager.find(DeviceTokenEntity.name, options);
    await qr.manager.remove(res);
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
