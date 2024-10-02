import { inject, injectable } from 'inversify';
import { FindManyOptions } from 'typeorm';
import { Currency } from 'src/model/entity/Currency';
import { CurrencyEntity } from 'src/model/entity/CurrencyEntity';
import { Database } from 'src/util/Database';

/**
 * Access class for Currency model.
 */
@injectable()
export class CurrencyAccess {
  @inject(Database)
  private readonly database!: Database;

  public async save(currency: Currency) {
    const qr = await this.database.getQueryRunner();
    const entity = new CurrencyEntity();
    Object.assign(entity, currency);

    return await qr.manager.save(entity);
  }

  public async findById(id: string) {
    const qr = await this.database.getQueryRunner();

    return await qr.manager.findOneOrFail<Currency>(CurrencyEntity.name, {
      where: { id },
    });
  }

  public async findByBookId(bookId: string) {
    const qr = await this.database.getQueryRunner();

    return await qr.manager.find<Currency>(CurrencyEntity.name, {
      where: { bookId },
    });
  }

  public async findPrimaryByBookId(bookId: string) {
    const qr = await this.database.getQueryRunner();

    return await qr.manager.findOneOrFail<Currency>(CurrencyEntity.name, {
      where: { bookId, isPrimary: true },
    });
  }

  public async hardDelete(options: FindManyOptions<Currency>) {
    const qr = await this.database.getQueryRunner();
    const res = await qr.manager.find(CurrencyEntity.name, options);
    await qr.manager.remove(res);
  }
}
