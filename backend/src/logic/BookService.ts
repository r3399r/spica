import { BadRequestError, UnauthorizedError } from '@y-celestial/service';
import { inject, injectable } from 'inversify';
import { BookAccess } from 'src/access/BookAccess';
import {
  PostBookRequest,
  PostBookResponse,
  PutBookRequest,
} from 'src/model/api/Book';
import { AuthHeaders } from 'src/model/api/Common';
import { BookEntity } from 'src/model/entity/BookEntity';
import { randomBase33 } from 'src/util/random';

/**
 * Service class for Book
 */
@injectable()
export class BookService {
  @inject(BookAccess)
  private readonly bookAccess!: BookAccess;

  public async cleanup() {
    await this.bookAccess.cleanup();
  }

  public async createBook(data: PostBookRequest): Promise<PostBookResponse> {
    const book = new BookEntity();
    book.name = data.name;
    book.code = randomBase33(6);
    book.dateLastChanged = new Date();

    return await this.bookAccess.save(book);
  }

  public async reviseBook(
    id: string,
    data: PutBookRequest,
    headers: AuthHeaders
  ) {
    const oldBook = await this.bookAccess.findById(id);

    if (oldBook.code !== headers['x-api-code']) throw new UnauthorizedError();

    const book = new BookEntity();
    book.id = id;
    book.name = data.name;
    book.code = oldBook.code;
    book.dateLastChanged = new Date();

    const res = await this.bookAccess.update(book);

    if (res.affected === 0) throw new BadRequestError('nothing happened.');
  }
}
