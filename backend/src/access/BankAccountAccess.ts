import { inject, injectable } from 'inversify';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { BankAccount } from 'src/model/entity/BankAccount';
import { BankAccountEntity } from 'src/model/entity/BankAccountEntity';
import { Database } from 'src/util/Database';

/**
 * Access class for BankAccount model.
 */
@injectable()
export class BankAccountAccess {
  @inject(Database)
  private readonly database!: Database;

  public async save(bankAccount: BankAccount) {
    const qr = await this.database.getQueryRunner();
    const entity = new BankAccountEntity();
    Object.assign(entity, bankAccount);

    return await qr.manager.save(entity);
  }

  public async find(options?: FindManyOptions<BankAccount>) {
    const qr = await this.database.getQueryRunner();

    return await qr.manager.find<BankAccount>(BankAccountEntity.name, {
      ...options,
    });
  }

  public async findOneOrFail(options?: FindOneOptions<BankAccount>) {
    const qr = await this.database.getQueryRunner();

    return await qr.manager.findOneOrFail<BankAccount>(BankAccountEntity.name, {
      ...options,
    });
  }

  public async hardDelete(options: FindManyOptions<BankAccount>) {
    const qr = await this.database.getQueryRunner();
    const res = await qr.manager.find(BankAccountEntity.name, options);
    await qr.manager.remove(res);
  }
}
