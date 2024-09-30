import { inject, injectable } from 'inversify';
import { In, IsNull } from 'typeorm';
import { Transfer } from 'src/model/entity/Transfer';
import { TransferEntity } from 'src/model/entity/TransferEntity';
import { InternalServerError } from 'src/model/error';
import { Database } from 'src/util/Database';

/**
 * Access class for Transfer model.
 */
@injectable()
export class TransferAccess {
  @inject(Database)
  private readonly database!: Database;

  public async save(input: Transfer) {
    const qr = await this.database.getQueryRunner();
    const entity = new TransferEntity();
    Object.assign(entity, input);

    return await qr.manager.save(entity);
  }

  public async findById(id: string) {
    const qr = await this.database.getQueryRunner();

    return await qr.manager.find<Transfer>(TransferEntity.name, {
      where: { id },
    });
  }

  public async findByIds(ids: string[]) {
    const qr = await this.database.getQueryRunner();

    return await qr.manager.find<Transfer>(TransferEntity.name, {
      where: { id: In(ids) },
      order: { ver: 'ASC' },
    });
  }

  public async findUndeletedById(id: string) {
    const qr = await this.database.getQueryRunner();

    return await qr.manager.findOneByOrFail<Transfer>(TransferEntity.name, {
      id,
      dateDeleted: IsNull(),
    });
  }

  public async findByCurrencyId(currencyId: string) {
    const qr = await this.database.getQueryRunner();

    return await qr.manager.find<Transfer>(TransferEntity.name, {
      where: { currencyId },
    });
  }

  public async update(input: Transfer) {
    const qr = await this.database.getQueryRunner();
    const entity = new TransferEntity();
    Object.assign(entity, input);

    const res = await qr.manager.update(
      TransferEntity,
      { id: input.id, ver: input.ver },
      entity
    );

    if (res.affected === 0) throw new InternalServerError('nothing happened.');
  }

  public async hardDeleteByBookId(id: string) {
    const qr = await this.database.getQueryRunner();

    await qr.manager.delete(TransferEntity.name, { bookId: id });
  }
}
