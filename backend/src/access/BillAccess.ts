import { inject, injectable } from 'inversify';
import { IsNull, ObjectLiteral } from 'typeorm';
import { Bill } from 'src/model/entity/Bill';
import { BillEntity } from 'src/model/entity/BillEntity';
import { InternalServerError } from 'src/model/error';
import { Database } from 'src/util/Database';

/**
 * Access class for Bill model.
 */
@injectable()
export class BillAccess {
  @inject(Database)
  private readonly database!: Database;

  public async save(input: Bill) {
    const qr = await this.database.getQueryRunner();
    const entity = new BillEntity();
    Object.assign(entity, input);

    return await qr.manager.save(entity);
  }

  public async findUndeletedById(id: string) {
    const qr = await this.database.getQueryRunner();

    return await qr.manager.findOneByOrFail<Bill>(BillEntity.name, {
      id,
      dateDeleted: IsNull(),
    });
  }

  public async update(input: Bill) {
    const qr = await this.database.getQueryRunner();
    const entity = new BillEntity();
    Object.assign(entity, input);

    const res = await qr.manager.update(
      BillEntity,
      { id: input.id, ver: input.ver },
      entity
    );

    if (res.affected === 0) throw new InternalServerError('nothing happened.');
  }

  public async findByBookId(bookId: string) {
    const qr = await this.database.getQueryRunner();

    return await qr.manager.find<Bill>(BillEntity.name, {
      where: { bookId },
    });
  }

  public async findByCurrencyId(currencyId: string) {
    const qr = await this.database.getQueryRunner();

    return await qr.manager.find<Bill>(BillEntity.name, {
      where: { currencyId },
    });
  }

  private async executeDelete(where: string, parameters?: ObjectLiteral) {
    const qb = await this.database.getQueryBuilder();
    await qb.delete().from(BillEntity.name).where(where, parameters).execute();
  }

  public async hardDeleteByBookId(id: string) {
    await this.executeDelete('book_id = :id', { id });
  }
}
