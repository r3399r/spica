import { bindings } from 'src/bindings';
import { BookService } from 'src/logic/BookService';
import {
  GetBookIdParams,
  PostBookBillRequest,
  PostBookCurrencyRequest,
  PostBookIdRequest,
  PostBookMemberRequest,
  PostBookRequest,
  PostBookTransferRequest,
  PutBookBillRequest,
  PutBookCurrencyRequest,
  PutBookMemberRequest,
  PutBookRequest,
  PutBookTransferRequest,
} from 'src/model/api/Book';
import { BadRequestError, InternalServerError } from 'src/model/error';
import { LambdaContext, LambdaEvent } from 'src/model/Lambda';

let event: LambdaEvent;
let service: BookService;

export async function book(lambdaEvent: LambdaEvent, _context?: LambdaContext) {
  event = lambdaEvent;
  service = bindings.get(BookService);

  switch (event.resource) {
    case '/api/book':
      return await apiBook();
    case '/api/book/{id}':
      return await apiBookId();
    case '/api/book/{id}/bill':
      return await apiBookIdBill();
    case '/api/book/{id}/bill/{billId}':
      return await apiBookIdBillId();
    case '/api/book/{id}/currency':
      return await apiBookIdCurrency();
    case '/api/book/{id}/currency/{cid}':
      return await apiBookIdCurrencyId();
    case '/api/book/{id}/currency/{cid}/primary':
      return await apiBookIdCurrencyIdPrimary();
    case '/api/book/{id}/member':
      return await apiBookIdMember();
    case '/api/book/{id}/member/{mid}':
      return await apiBookIdMemberId();
    case '/api/book/{id}/member/{mid}/self':
      return await apiBookIdMemberIdSelf();
    case '/api/book/{id}/showDelete':
      return await apiBookIdShowDelete();
    case '/api/book/{id}/transfer':
      return await apiBookIdTransfer();
    case '/api/book/{id}/transfer/{tid}':
      return await apiBookIdTransferId();
  }
  throw new InternalServerError('unknown resource');
}

async function apiBook() {
  if (event.headers === null)
    throw new BadRequestError('headers should not be empty');
  switch (event.httpMethod) {
    case 'GET':
      return service.getBookList(event.headers['x-api-device']);
    case 'POST':
      if (event.body === null)
        throw new BadRequestError('body should not be empty');

      return service.createBook(
        JSON.parse(event.body) as PostBookRequest,
        event.headers['x-api-device']
      );
    default:
      throw new InternalServerError('unknown http method');
  }
}

async function apiBookId() {
  if (event.pathParameters === null)
    throw new BadRequestError('pathParameters should not be empty');
  if (event.headers === null)
    throw new BadRequestError('headers should not be empty');
  switch (event.httpMethod) {
    case 'GET':
      return service.getBook(
        event.pathParameters.id,
        event.headers['x-api-device'],
        event.queryStringParameters as GetBookIdParams | null
      );
    case 'PUT':
      if (event.body === null)
        throw new BadRequestError('body should not be empty');

      return service.reviseBook(
        event.pathParameters.id,
        JSON.parse(event.body) as PutBookRequest,
        event.headers['x-api-device']
      );
    case 'POST':
      if (event.body === null)
        throw new BadRequestError('body should not be empty');

      return service.addDeviceBook(
        event.pathParameters.id,
        JSON.parse(event.body) as PostBookIdRequest,
        event.headers['x-api-device']
      );
    case 'DELETE':
      return service.deleteDeviceBook(
        event.pathParameters.id,
        event.headers['x-api-device']
      );
    default:
      throw new InternalServerError('unknown http method');
  }
}

async function apiBookIdBill() {
  if (event.pathParameters === null)
    throw new BadRequestError('pathParameters should not be empty');
  switch (event.httpMethod) {
    case 'POST':
      if (event.body === null)
        throw new BadRequestError('body should not be empty');
      if (event.headers === null)
        throw new BadRequestError('headers should not be empty');

      return service.addBill(
        event.pathParameters.id,
        JSON.parse(event.body) as PostBookBillRequest,
        event.headers['x-api-device']
      );
    default:
      throw new InternalServerError('unknown http method');
  }
}

async function apiBookIdBillId() {
  if (event.pathParameters === null)
    throw new BadRequestError('pathParameters should not be empty');
  if (event.headers === null)
    throw new BadRequestError('headers should not be empty');
  switch (event.httpMethod) {
    case 'PUT':
      if (event.body === null)
        throw new BadRequestError('body should not be empty');

      return service.updateBill(
        event.pathParameters.id,
        event.pathParameters.billId,
        JSON.parse(event.body) as PutBookBillRequest,
        event.headers['x-api-device']
      );
    case 'DELETE':
      return service.deleteBill(
        event.pathParameters.id,
        event.pathParameters.billId,
        event.headers['x-api-device']
      );
    default:
      throw new InternalServerError('unknown http method');
  }
}

async function apiBookIdCurrency() {
  if (event.pathParameters === null)
    throw new BadRequestError('pathParameters should not be empty');
  switch (event.httpMethod) {
    case 'POST':
      if (event.body === null)
        throw new BadRequestError('body should not be empty');
      if (event.headers === null)
        throw new BadRequestError('headers should not be empty');

      return service.addCurrency(
        event.pathParameters.id,
        JSON.parse(event.body) as PostBookCurrencyRequest,
        event.headers['x-api-device']
      );
    default:
      throw new InternalServerError('unknown http method');
  }
}

async function apiBookIdCurrencyId() {
  if (event.pathParameters === null)
    throw new BadRequestError('pathParameters should not be empty');
  if (event.headers === null)
    throw new BadRequestError('headers should not be empty');
  switch (event.httpMethod) {
    case 'PUT':
      if (event.body === null)
        throw new BadRequestError('body should not be empty');

      return service.updateCurrency(
        event.pathParameters.id,
        event.pathParameters.cid,
        JSON.parse(event.body) as PutBookCurrencyRequest,
        event.headers['x-api-device']
      );
    case 'DELETE':
      return service.deleteCurrency(
        event.pathParameters.id,
        event.pathParameters.cid,
        event.headers['x-api-device']
      );
    default:
      throw new InternalServerError('unknown http method');
  }
}

async function apiBookIdCurrencyIdPrimary() {
  if (event.pathParameters === null)
    throw new BadRequestError('pathParameters should not be empty');
  if (event.headers === null)
    throw new BadRequestError('headers should not be empty');
  switch (event.httpMethod) {
    case 'PUT':
      return service.reviseCurrencyPrimary(
        event.pathParameters.id,
        event.pathParameters.cid,
        event.headers['x-api-device']
      );
    default:
      throw new InternalServerError('unknown http method');
  }
}

async function apiBookIdMember() {
  if (event.pathParameters === null)
    throw new BadRequestError('pathParameters should not be empty');
  switch (event.httpMethod) {
    case 'POST':
      if (event.body === null)
        throw new BadRequestError('body should not be empty');
      if (event.headers === null)
        throw new BadRequestError('headers should not be empty');

      return service.addMember(
        event.pathParameters.id,
        JSON.parse(event.body) as PostBookMemberRequest,
        event.headers['x-api-device']
      );
    default:
      throw new InternalServerError('unknown http method');
  }
}

async function apiBookIdMemberId() {
  if (event.pathParameters === null)
    throw new BadRequestError('pathParameters should not be empty');
  if (event.headers === null)
    throw new BadRequestError('headers should not be empty');
  switch (event.httpMethod) {
    case 'PUT':
      if (event.body === null)
        throw new BadRequestError('body should not be empty');

      return service.reviseMemberNickname(
        event.pathParameters.id,
        event.pathParameters.mid,
        JSON.parse(event.body) as PutBookMemberRequest,
        event.headers['x-api-device']
      );
    case 'DELETE':
      return service.deleteMember(
        event.pathParameters.id,
        event.pathParameters.mid,
        event.headers['x-api-device']
      );
    default:
      throw new InternalServerError('unknown http method');
  }
}

async function apiBookIdMemberIdSelf() {
  if (event.pathParameters === null)
    throw new BadRequestError('pathParameters should not be empty');
  if (event.headers === null)
    throw new BadRequestError('headers should not be empty');
  switch (event.httpMethod) {
    case 'PUT':
      return service.reviseMemberSelf(
        event.pathParameters.id,
        event.pathParameters.mid,
        event.headers['x-api-device']
      );
    default:
      throw new InternalServerError('unknown http method');
  }
}

async function apiBookIdShowDelete() {
  if (event.pathParameters === null)
    throw new BadRequestError('pathParameters should not be empty');
  if (event.headers === null)
    throw new BadRequestError('headers should not be empty');
  switch (event.httpMethod) {
    case 'PUT':
      return service.setDeviceBookShowDelete(
        event.pathParameters.id,
        event.headers['x-api-device']
      );
    default:
      throw new InternalServerError('unknown http method');
  }
}

async function apiBookIdTransfer() {
  if (event.pathParameters === null)
    throw new BadRequestError('pathParameters should not be empty');
  switch (event.httpMethod) {
    case 'POST':
      if (event.body === null)
        throw new BadRequestError('body should not be empty');
      if (event.headers === null)
        throw new BadRequestError('headers should not be empty');

      return service.addTransfer(
        event.pathParameters.id,
        JSON.parse(event.body) as PostBookTransferRequest,
        event.headers['x-api-device']
      );
    default:
      throw new InternalServerError('unknown http method');
  }
}

async function apiBookIdTransferId() {
  if (event.pathParameters === null)
    throw new BadRequestError('pathParameters should not be empty');
  if (event.headers === null)
    throw new BadRequestError('headers should not be empty');
  switch (event.httpMethod) {
    case 'PUT':
      if (event.body === null)
        throw new BadRequestError('body should not be empty');

      return service.updateTransfer(
        event.pathParameters.id,
        event.pathParameters.tid,
        JSON.parse(event.body) as PutBookTransferRequest,
        event.headers['x-api-device']
      );
    case 'DELETE':
      return service.deleteTransfer(
        event.pathParameters.id,
        event.pathParameters.tid,
        event.headers['x-api-device']
      );
    default:
      throw new InternalServerError('unknown http method');
  }
}
