import { inject, injectable } from 'inversify';
import { FindManyOptions } from 'typeorm';
import { Bank } from 'src/model/entity/Bank';
import { BankEntity } from 'src/model/entity/BankEntity';
import { InternalServerError } from 'src/model/error';
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

  public async hardDeleteMany(criteria: Partial<Bank>[]) {
    const qr = await this.database.getQueryRunner();
    const res = await qr.manager.delete(BankEntity.name, criteria);

    if (res.affected === 0) throw new InternalServerError('nothing happened.');
  }
}
