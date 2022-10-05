import {
  Body,
  Controller,
  Delete,
  Example,
  Get,
  Path,
  Post,
  Put,
  Query,
  Route,
  Security,
  Tags,
} from 'tsoa';
import {
  BillType,
  GetBookIdResponse,
  GetBookNameResponse,
  GetBookResponse,
  PostBookBillRequest,
  PostBookBillResponse,
  PostBookMemberRequest,
  PostBookMemberResponse,
  PostBookRequest,
  PostBookResponse,
  PostBookTransferRequest,
  PostBookTransferResponse,
  PutBookBillRequest,
  PutBookBillResponse,
  PutBookMemberRequest,
  PutBookMemberResponse,
  PutBookRequest,
  PutBookResponse,
  PutBookTransferRequest,
  PutBookTransferResponse,
} from '@y-celestial/spica-service';

@Route('book')
@Tags('帳簿')
export class BookController extends Controller {
  /**
   * @summary 取得多個帳簿
   * @example _ids "book-id,book-id2"
   */
  @Example<GetBookResponse>([
    {
      id: 'book-id',
      code: '123456',
      name: 'book-name',
      dateCreated: new Date(),
      dateUpdated: new Date(),
    },
  ])
  @Security('api_token')
  @Get()
  getBook(@Query('ids') _ids: string): GetBookResponse {
    return {} as any;
  }
  /**
   * @summary 建立新帳簿
   * @example _postBookRequest {
   *   "name": "book-name"
   * }
   */
  @Example<PostBookResponse>({
    id: 'book-id',
    code: '123456',
    name: 'book-name',
    dateCreated: new Date(),
    dateUpdated: new Date(),
  })
  @Security('api_token')
  @Post()
  postBook(@Body() _postBookRequest: PostBookRequest): PostBookResponse {
    return {} as any;
  }
  /**
   * @summary 取得指定帳簿詳情
   * @example _id "book-id"
   */
  @Example<GetBookIdResponse>({
    id: 'book-id',
    code: '123456',
    name: 'book-name',
    dateCreated: new Date(),
    dateUpdated: new Date(),
    members: [
      {
        id: 'member-id',
        bookId: 'book-id',
        nickname: 'Shohei',
        balance: 100,
        deletable: false,
        dateCreated: new Date(),
        dateUpdated: new Date(),
      },
    ],
    transactions: [
      {
        id: 'bill-id',
        ver: '1',
        bookId: 'book-id',
        date: new Date(),
        type: 'income' as BillType,
        descr: 'sample',
        amount: 100,
        memo: 'memo-bill',
        dateCreated: new Date(),
        dateUpdated: null,
        dateDeleted: null,
        detail: [
          {
            id: 'bill-share-id',
            memberId: 'member-id-1',
            amount: 50,
            dateCreated: new Date(),
            dateUpdated: null,
          },
          {
            id: 'bill-share-id',
            memberId: 'member-id-2',
            amount: 50,
            dateCreated: new Date(),
            dateUpdated: null,
          },
        ],
      },
      {
        id: 'transfer-id',
        ver: '1',
        bookId: 'book-id',
        date: new Date(),
        amount: 100,
        srcMemberId: 'member-id-1',
        dstMemberId: 'member-id-2',
        memo: 'memo-transfer',
        dateCreated: new Date(),
        dateUpdated: null,
        dateDeleted: null,
      },
    ],
  })
  @Security('api_token')
  @Get('{id}')
  getBookId(@Path('id') _id: string): GetBookIdResponse {
    return {} as any;
  }
  /**
   * @summary 重新命名帳簿
   * @example _id "book-id"
   * @example _putBookRequest {
   *   "name": "book-name-new"
   * }
   */
  @Example<PutBookResponse>({
    id: 'book-id',
    code: '123456',
    name: 'book-name-new',
    dateCreated: new Date(),
    dateUpdated: new Date(),
  })
  @Security('api_token')
  @Put('{id}')
  putBookId(
    @Path('id') _id: string,
    @Body() _putBookRequest: PutBookRequest
  ): PutBookResponse {
    return {} as any;
  }
  /**
   * @summary 新增分帳
   * @example _id "book-id"
   * @example _postBookBillRequest {
   *   "date": "2022-09-30T15:58:37.080Z",
   *   "type":"income",
   *   "descr":"sample",
   *   "amount":100,
   *   "former":[{
   *     "id":"member-id-1",
   *     "type":"weight",
   *     "value":1
   *   }],
   *   "latter":[{
   *     "id":"member-id-2",
   *     "type":"weight",
   *     "value":1
   *   }],
   *   "memo":"memo-bill"
   * }
   */
  @Example<PostBookBillResponse>({
    members: [
      {
        id: 'member-id-1',
        bookId: 'book-id',
        nickname: 'nickname',
        balance: 50,
        deletable: false,
        dateCreated: new Date(),
        dateUpdated: null,
      },
    ],
    transaction: {
      id: 'bill-id',
      ver: '1',
      bookId: 'book-id',
      date: new Date(),
      type: 'income' as BillType,
      descr: 'sample',
      amount: 100,
      memo: 'memo-bill',
      dateCreated: new Date(),
      dateUpdated: null,
      dateDeleted: null,
      detail: [
        {
          id: 'bill-share-id',
          memberId: 'member-id-1',
          amount: 50,
          dateCreated: new Date(),
          dateUpdated: null,
        },
        {
          id: 'bill-share-id',
          memberId: 'member-id-2',
          amount: 50,
          dateCreated: new Date(),
          dateUpdated: null,
        },
      ],
    },
  })
  @Security('api_token')
  @Post('{id}/bill')
  postBookIdBill(
    @Path('id') _id: string,
    @Body() _postBookBillRequest: PostBookBillRequest
  ): PostBookBillResponse {
    return {} as any;
  }
  /**
   * @summary 刪除分帳
   * @example _id "book-id"
   * @example _billId "bill-id"
   */
  @Security('api_token')
  @Delete('{id}/bill/{billId}')
  deleteBookIdBill(@Path('id') _id: string, @Path('billId') _billId: string) {}
  /**
   * @summary 修改分帳
   * @example _id "book-id"
   * @example _billId "bill-id"
   * @example _putBookBillRequest {
   *   "date": "2022-09-30T15:58:37.080Z",
   *   "type":"income",
   *   "descr":"sample",
   *   "amount":100,
   *   "former":[{
   *     "id":"member-id-1",
   *     "type":"weight",
   *     "value":1
   *   }],
   *   "latter":[{
   *     "id":"member-id-2",
   *     "type":"weight",
   *     "value":1
   *   }],
   *   "memo":"memo-bill"
   * }
   */
  @Example<PutBookBillResponse>({
    members: [
      {
        id: 'member-id-1',
        bookId: 'book-id',
        nickname: 'nickname',
        balance: 50,
        deletable: false,
        dateCreated: new Date(),
        dateUpdated: null,
      },
    ],
    transaction: {
      id: 'bill-id',
      ver: '1',
      bookId: 'book-id',
      date: new Date(),
      type: 'income' as BillType,
      descr: 'sample',
      amount: 100,
      memo: 'memo-bill',
      dateCreated: new Date(),
      dateUpdated: null,
      dateDeleted: null,
      detail: [
        {
          id: 'bill-share-id',
          memberId: 'member-id-1',
          amount: 50,
          dateCreated: new Date(),
          dateUpdated: null,
        },
        {
          id: 'bill-share-id',
          memberId: 'member-id-2',
          amount: 50,
          dateCreated: new Date(),
          dateUpdated: null,
        },
      ],
    },
  })
  @Security('api_token')
  @Put('{id}/bill/{billId}')
  putBookIdBill(
    @Path('id') _id: string,
    @Path('billId') _billId: string,
    @Body() _putBookBillRequest: PutBookBillRequest
  ): PutBookBillResponse {
    return {} as any;
  }
  /**
   * @summary 新增帳簿成員
   * @example _id "book-id"
   * @example _postBookMemberRequest {
   *   "nickname": "Einstein"
   * }
   */
  @Example<PostBookMemberResponse>({
    id: 'member-id',
    bookId: 'book-id',
    nickname: 'Einstein',
    balance: 100,
    deletable: false,
    dateCreated: new Date(),
    dateUpdated: null,
  })
  @Security('api_token')
  @Post('{id}/member')
  postBookIdMember(
    @Path('id') _id: string,
    @Body() _postBookMemberRequest: PostBookMemberRequest
  ): PostBookMemberResponse {
    return {} as any;
  }
  /**
   * @summary 刪除帳本成員
   * @example _id "book-id"
   * @example _mid "member-id"
   */
  @Security('api_token')
  @Delete('{id}/member/{mid}')
  deleteBookIdMember(@Path('id') _id: string, @Path('mid') _mid: string) {}
  /**
   * @summary 重新命名帳本成員
   * @example _id "book-id"
   * @example _mid "member-id"
   * @example _putBookMemberRequest {
   *   "nickname": "Albert"
   * }
   */
  @Example<PutBookMemberResponse>({
    id: 'member-id',
    bookId: 'book-id',
    nickname: 'Albert',
    balance: 100,
    deletable: false,
    dateCreated: new Date(),
    dateUpdated: null,
  })
  @Security('api_token')
  @Put('{id}/member/{mid}')
  putBookIdMember(
    @Path('id') _id: string,
    @Path('mid') _mid: string,
    @Body() _putBookMemberRequest: PutBookMemberRequest
  ): PutBookMemberResponse {
    return {} as any;
  }
  /**
   * @summary 取得指定帳簿名稱
   * @example _id "book-id"
   */
  @Example<GetBookNameResponse>({
    id: 'book-id',
    name: 'book-name',
  })
  @Get('{id}/name')
  getBookIdName(@Path('id') _id: string): GetBookNameResponse {
    return {} as any;
  }
  /**
   * @summary 新增轉帳
   * @example _id "book-id"
   * @example _postBookTransferRequest {
   *   "date": "2022-09-30T15:58:37.080Z",
   *   "amount":100,
   *   "srcMemberId": "member-id-1",
   *   "dstMemberId": "member-id-2",
   *   "memo":"memo-transfer"
   * }
   */
  @Example<PostBookTransferResponse>({
    members: [
      {
        id: 'member-id-1',
        bookId: 'book-id',
        nickname: 'nickname',
        balance: 50,
        deletable: false,
        dateCreated: new Date(),
        dateUpdated: null,
      },
    ],
    transaction: {
      id: 'bill-id',
      ver: '1',
      bookId: 'book-id',
      date: new Date(),
      amount: 100,
      srcMemberId: 'member-id-1',
      dstMemberId: 'member-id-2',
      memo: 'memo-transfer',
      dateCreated: new Date(),
      dateUpdated: null,
      dateDeleted: null,
    },
  })
  @Security('api_token')
  @Post('{id}/transfer')
  postBookIdTransfer(
    @Path('id') _id: string,
    @Body() _postBookTransferRequest: PostBookTransferRequest
  ): PostBookTransferResponse {
    return {} as any;
  }
  /**
   * @summary 刪除轉帳
   * @example _id "book-id"
   * @example _tid "transfer-id"
   */
  @Security('api_token')
  @Delete('{id}/transfer/{tid}')
  deleteBookIdTransfer(@Path('id') _id: string, @Path('tid') _tid: string) {}
  /**
   * @summary 修改轉帳
   * @example _id "book-id"
   * @example _tid "transfer-id"
   * @example _putBookTransferRequest {
   *   "date": "2022-09-30T15:58:37.080Z",
   *   "amount":100,
   *   "srcMemberId": "member-id-1",
   *   "dstMemberId": "member-id-2",
   *   "memo":"memo-transfer"
   * }
   */
  @Example<PutBookTransferResponse>({
    members: [
      {
        id: 'member-id-1',
        bookId: 'book-id',
        nickname: 'nickname',
        balance: 50,
        deletable: false,
        dateCreated: new Date(),
        dateUpdated: null,
      },
    ],
    transaction: {
      id: 'bill-id',
      ver: '1',
      bookId: 'book-id',
      date: new Date(),
      amount: 100,
      srcMemberId: 'member-id-1',
      dstMemberId: 'member-id-2',
      memo: 'memo-transfer',
      dateCreated: new Date(),
      dateUpdated: null,
      dateDeleted: null,
    },
  })
  @Security('api_token')
  @Put('{id}/transfer/{tid}')
  putBookIdTransfer(
    @Path('id') _id: string,
    @Path('tid') _tid: string,
    @Body() _putBookTransferRequest: PutBookTransferRequest
  ): PutBookTransferResponse {
    return {} as any;
  }
}
