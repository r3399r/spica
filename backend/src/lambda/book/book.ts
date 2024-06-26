import { bindings } from 'src/bindings';
import { BookService } from 'src/logic/BookService';
import {
  GetBookIdParams,
  PostBookBillRequest,
  PostBookCurrencyRequest,
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
import { LambdaContext, LambdaEvent, LambdaOutput } from 'src/model/Lambda';
import { errorOutput, successOutput } from 'src/util/LambdaOutput';

export async function book(
  event: LambdaEvent,
  _context?: LambdaContext
): Promise<LambdaOutput> {
  let service: BookService | null = null;
  try {
    service = bindings.get(BookService);

    let res: unknown;

    switch (event.resource) {
      case '/api/book':
        res = await apiBook(event, service);
        break;
      case '/api/book/{id}':
        res = await apiBookId(event, service);
        break;
      case '/api/book/{id}/bill':
        res = await apiBookIdBill(event, service);
        break;
      case '/api/book/{id}/bill/{billId}':
        res = await apiBookIdBillId(event, service);
        break;
      case '/api/book/{id}/currency':
        res = await apiBookIdCurrency(event, service);
        break;
      case '/api/book/{id}/currency/{cid}':
        res = await apiBookIdCurrencyId(event, service);
        break;
      case '/api/book/{id}/currency/{cid}/primary':
        res = await apiBookIdCurrencyIdPrimary(event, service);
        break;
      case '/api/book/{id}/member':
        res = await apiBookIdMember(event, service);
        break;
      case '/api/book/{id}/member/{mid}':
        res = await apiBookIdMemberId(event, service);
        break;
      case '/api/book/{id}/member/{mid}/self':
        res = await apiBookIdMemberIdSelf(event, service);
        break;
      case '/api/book/{id}/showDelete':
        res = await apiBookIdShowDelete(event, service);
        break;
      case '/api/book/{id}/transfer':
        res = await apiBookIdTransfer(event, service);
        break;
      case '/api/book/{id}/transfer/{tid}':
        res = await apiBookIdTransferId(event, service);
        break;
      default:
        throw new InternalServerError('unknown resource');
    }

    return successOutput(res);
  } catch (e) {
    return errorOutput(e);
  } finally {
    await service?.cleanup();
  }
}

async function apiBook(event: LambdaEvent, service: BookService) {
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

async function apiBookId(event: LambdaEvent, service: BookService) {
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
      return service.addDeviceBook(
        event.pathParameters.id,
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

async function apiBookIdBill(event: LambdaEvent, service: BookService) {
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

async function apiBookIdBillId(event: LambdaEvent, service: BookService) {
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

async function apiBookIdCurrency(event: LambdaEvent, service: BookService) {
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

async function apiBookIdCurrencyId(event: LambdaEvent, service: BookService) {
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

async function apiBookIdCurrencyIdPrimary(
  event: LambdaEvent,
  service: BookService
) {
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

async function apiBookIdMember(event: LambdaEvent, service: BookService) {
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

async function apiBookIdMemberId(event: LambdaEvent, service: BookService) {
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

async function apiBookIdMemberIdSelf(event: LambdaEvent, service: BookService) {
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

async function apiBookIdShowDelete(event: LambdaEvent, service: BookService) {
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

async function apiBookIdTransfer(event: LambdaEvent, service: BookService) {
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

async function apiBookIdTransferId(event: LambdaEvent, service: BookService) {
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
