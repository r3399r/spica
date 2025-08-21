import { inject, injectable } from 'inversify';
import { FindOneOptions, ObjectLiteral } from 'typeorm';
import { Book } from 'src/model/entity/Book';
import { BookEntity } from 'src/model/entity/BookEntity';
import { InternalServerError } from 'src/model/error';
import { Database } from 'src/util/Database';

/**
 * Access class for Book model.
 */
@injectable()
export class BookAccess {
  @inject(Database)
  private readonly database!: Database;

  public async save(book: Book) {
    const qr = await this.database.getQueryRunner();
    const entity = new BookEntity();
    Object.assign(entity, book);

    return await qr.manager.save(entity);
  }

  public async update(book: Book) {
    const qr = await this.database.getQueryRunner();
    const entity = new BookEntity();
    Object.assign(entity, book);

    const res = await qr.manager.update(BookEntity, book.id, entity);

    if (res.affected === 0) throw new InternalServerError('nothing happened.');
  }

  private async executeDelete(where: string, parameters?: ObjectLiteral) {
    const qb = await this.database.getQueryBuilder();
    await qb.delete().from(BookEntity.name).where(where, parameters).execute();
  }

  public async hardDeleteById(id: string) {
    await this.executeDelete('id = :id', { id });
  }

  public async findOne(options?: FindOneOptions<Book>) {
    const qr = await this.database.getQueryRunner();

    return await qr.manager.findOne<Book>(BookEntity.name, {
      ...options,
    });
  }

  public async findOneOrFail(options?: FindOneOptions<Book>) {
    const qr = await this.database.getQueryRunner();

    return await qr.manager.findOneOrFail<Book>(BookEntity.name, {
      ...options,
    });
  }
}
