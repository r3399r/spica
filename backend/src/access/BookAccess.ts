import { BadRequestError } from '@y-celestial/service';
import { inject, injectable } from 'inversify';
import { Book } from 'src/model/entity/Book';
import { BookEntity } from 'src/model/entity/BookEntity';
import { Database } from 'src/util/Database';

/**
 * Access class for Book model.
 */
@injectable()
export class BookAccess {
  @inject(Database)
  private readonly database!: Database;

  public async findById(id: string) {
    const qr = await this.database.getQueryRunner();

    return await qr.manager.findOneByOrFail<Book>(BookEntity.name, { id });
  }

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

    if (res.affected === 0) throw new BadRequestError('nothing happened.');
  }
}
