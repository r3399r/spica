import { inject, injectable } from 'inversify';
import { FindManyOptions } from 'typeorm';
import { Bank } from 'src/model/entity/Bank';
import { BankEntity } from 'src/model/entity/BankEntity';
import { BadRequestError } from 'src/model/error';
import { Database } from 'src/util/Database';

/**
 * Access class for Bank model.
 */
@injectable()
export class BankAccess {
  @inject(Database)
  private readonly database!: Database;

  public async save(bank: Bank) {
    const qr = await this.database.getQueryRunner();
    const entity = new BankEntity();
    Object.assign(entity, bank);

    return await qr.manager.save(entity);
  }

  public async find(options?: FindManyOptions<Bank>) {
    const qr = await this.database.getQueryRunner();

    return await qr.manager.find<Bank>(BankEntity.name, {
      ...options,
    });
  }

  public async hardDeleteById(id: string) {
    const qr = await this.database.getQueryRunner();

    const res = await qr.manager.delete(BankEntity.name, id);

    if (res.affected === 0) throw new BadRequestError('nothing happened.');
  }
}
