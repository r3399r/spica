import { inject, injectable } from 'inversify';
import { FindManyOptions, ObjectLiteral } from 'typeorm';
import { DeviceBook } from 'src/model/entity/DeviceBook';
import { DeviceBookEntity } from 'src/model/entity/DeviceBookEntity';
import { InternalServerError } from 'src/model/error';
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

    if (res.affected === 0) throw new InternalServerError('nothing happened.');
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

  public async remove(options: FindManyOptions<DeviceBook>) {
    const qr = await this.database.getQueryRunner();
    const res = await qr.manager.find(DeviceBookEntity.name, options);
    await qr.manager.remove(res);
  }

  private async executeDelete(where: string, parameters?: ObjectLiteral) {
    const qb = await this.database.getQueryBuilder();
    await qb
      .delete()
      .from(DeviceBookEntity.name)
      .where(where, parameters)
      .execute();
  }

  public async hardDeleteByBookId(id: string) {
    await this.executeDelete('book_id = :id', { id });
  }
}
