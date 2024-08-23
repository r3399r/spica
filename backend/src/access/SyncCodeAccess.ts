import { inject, injectable } from 'inversify';
import { FindOneOptions } from 'typeorm';
import { SyncCode } from 'src/model/entity/SyncCode';
import { SyncCodeEntity } from 'src/model/entity/SyncCodeEntity';
import { Database } from 'src/util/Database';

/**
 * Access class for SyncCode model.
 */
@injectable()
export class SyncCodeAccess {
  @inject(Database)
  private readonly database!: Database;

  public async save(input: SyncCode) {
    const qr = await this.database.getQueryRunner();
    const entity = new SyncCodeEntity();
    Object.assign(entity, input);

    return await qr.manager.save(entity);
  }

  public async findOne(options: FindOneOptions<SyncCode>) {
    const qr = await this.database.getQueryRunner();

    return await qr.manager.findOne<SyncCode>(SyncCodeEntity.name, options);
  }

  public async findOneOrFail(options: FindOneOptions<SyncCode>) {
    const qr = await this.database.getQueryRunner();

    return await qr.manager.findOneOrFail<SyncCode>(
      SyncCodeEntity.name,
      options
    );
  }

  public async hardDeleteByEmail(email: string) {
    const qr = await this.database.getQueryRunner();

    return await qr.manager.delete(SyncCodeEntity.name, { email });
  }
}
