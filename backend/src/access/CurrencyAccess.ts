import { inject, injectable } from 'inversify';
import { Currency } from 'src/model/entity/Currency';
import { CurrencyEntity } from 'src/model/entity/CurrencyEntity';
import { BadRequestError } from 'src/model/error';
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

  public async hardDeleteById(id: string) {
    const qr = await this.database.getQueryRunner();

    const res = await qr.manager.delete(CurrencyEntity.name, id);

    if (res.affected === 0) throw new BadRequestError('nothing happened.');
  }
}
