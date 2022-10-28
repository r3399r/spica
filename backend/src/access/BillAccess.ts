import { inject, injectable } from 'inversify';
import { IsNull } from 'typeorm';
import { BadRequestError } from 'src/celestial-service/error';
import { Bill } from 'src/model/entity/Bill';
import { BillEntity } from 'src/model/entity/BillEntity';
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

    if (res.affected === 0) throw new BadRequestError('nothing happened.');
  }

  public async findByBookId(bookId: string) {
    const qr = await this.database.getQueryRunner();

    return await qr.manager.find<Bill>(BillEntity.name, {
      where: { bookId },
    });
  }

  public async hardDeleteByBookId(id: string) {
    const qr = await this.database.getQueryRunner();

    await qr.manager.delete(BillEntity.name, { bookId: id });
  }
}
