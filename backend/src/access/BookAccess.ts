import { inject, injectable } from 'inversify';
import { FindManyOptions } from 'typeorm';
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

  public async hardDelete(options: FindManyOptions<Book>) {
    const qr = await this.database.getQueryRunner();
    const res = await qr.manager.find(BookEntity.name, options);
    await qr.manager.remove(res);
  }
}
