import { BadRequestError, UnauthorizedError } from '@y-celestial/service';
import { inject, injectable } from 'inversify';
import { BookAccess } from 'src/access/BookAccess';
import { MemberAccess } from 'src/access/MemberAccess';
import {
  PostBookMemberRequest,
  PostBookRequest,
  PostBookResponse,
  PutBookMemberRequest,
  PutBookRequest,
} from 'src/model/api/Book';
import { AuthHeaders } from 'src/model/api/Common';
import { BookEntity } from 'src/model/entity/BookEntity';
import { MemberEntity } from 'src/model/entity/MemberEntity';
import { randomBase33 } from 'src/util/random';

/**
 * Service class for Book
 */
@injectable()
export class BookService {
  @inject(BookAccess)
  private readonly bookAccess!: BookAccess;

  @inject(MemberAccess)
  private readonly memberAccess!: MemberAccess;

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

    await this.bookAccess.update(book);
  }

  public async addMember(
    id: string,
    data: PostBookMemberRequest,
    headers: AuthHeaders
  ) {
    const book = await this.bookAccess.findById(id);
    if (book.code !== headers['x-api-code']) throw new UnauthorizedError();

    const member = new MemberEntity();
    member.nickname = data.nickname;
    member.bookId = id;
    member.deletable = true;

    await this.memberAccess.save(member);
  }

  public async reviseMemberNickname(
    bid: string,
    mid: string,
    data: PutBookMemberRequest,
    headers: AuthHeaders
  ) {
    const oldBook = await this.bookAccess.findById(bid);
    if (oldBook.code !== headers['x-api-code']) throw new UnauthorizedError();

    const oldMember = await this.memberAccess.findById(mid);
    const member = new MemberEntity();
    member.id = mid;
    member.bookId = bid;
    member.nickname = data.nickname;
    member.deletable = oldMember.deletable;

    await this.memberAccess.update(member);
  }

  public async deleteMember(bid: string, mid: string, headers: AuthHeaders) {
    const oldBook = await this.bookAccess.findById(bid);
    if (oldBook.code !== headers['x-api-code']) throw new UnauthorizedError();

    const member = await this.memberAccess.findById(mid);
    if (member.deletable === false)
      throw new BadRequestError('the member is not deletable');

    await this.memberAccess.hardDeleteById(mid);
  }
}
