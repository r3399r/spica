import { inject, injectable } from 'inversify';
import { FindManyOptions } from 'typeorm';
import { Bank } from 'src/model/entity/Bank';
import { BankEntity } from 'src/model/entity/BankEntity';
import { Database } from 'src/util/Database';

/**
 * Access class for Bank model.
 */
@injectable()
export class BankAccess {
  @inject(Database)
  private readonly database!: Database;

  public async saveMany(bank: Bank[]) {
    const qr = await this.database.getQueryRunner();

    return await qr.manager.save(bank);
  }

  public async find(options?: FindManyOptions<Bank>) {
    const qr = await this.database.getQueryRunner();

    return await qr.manager.find<Bank>(BankEntity.name, {
      ...options,
    });
  }

  public async hardDeleteAll(options?: FindManyOptions<Bank>) {
    const qr = await this.database.getQueryRunner();
    const res = await qr.manager.find(BankEntity.name, options);
    await qr.manager.remove(res);
  }
}
