import {
  BadRequestError,
  errorOutput,
  InternalServerError,
  LambdaContext,
  LambdaEvent,
  LambdaOutput,
  successOutput,
} from '@y-celestial/service';
import { bindings } from 'src/bindings';
import { BookService } from 'src/logic/BookService';
import {
  PostBookBillRequest,
  PostBookMemberRequest,
  PostBookRequest,
  PostBookResponse,
  PostBookTransferRequest,
  PutBookBillRequest,
  PutBookMemberRequest,
  PutBookRequest,
  PutBookTransferRequest,
} from 'src/model/api/Book';
import { AuthHeaders } from 'src/model/api/Common';

export async function book(
  event: LambdaEvent,
  _context?: LambdaContext
): Promise<LambdaOutput> {
  let service: BookService | null = null;
  try {
    service = bindings.get(BookService);

    let res: void | PostBookResponse;

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
      case '/api/book/{id}/member':
        res = await apiBookIdMember(event, service);
        break;
      case '/api/book/{id}/member/{mid}':
        res = await apiBookIdMemberId(event, service);
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
  switch (event.httpMethod) {
    case 'POST':
      if (event.body === null)
        throw new BadRequestError('body should not be empty');

      return service.createBook(JSON.parse(event.body) as PostBookRequest);
    default:
      throw new InternalServerError('unknown http method');
  }
}

async function apiBookId(event: LambdaEvent, service: BookService) {
  if (event.pathParameters === null)
    throw new BadRequestError('pathParameters should not be empty');
  switch (event.httpMethod) {
    case 'PUT':
      if (event.body === null)
        throw new BadRequestError('body should not be empty');

      return service.reviseBook(
        event.pathParameters.id,
        JSON.parse(event.body) as PutBookRequest,
        event.headers as AuthHeaders
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

      return service.addBill(
        event.pathParameters.id,
        JSON.parse(event.body) as PostBookBillRequest,
        event.headers as AuthHeaders
      );
    default:
      throw new InternalServerError('unknown http method');
  }
}

async function apiBookIdBillId(event: LambdaEvent, service: BookService) {
  if (event.pathParameters === null)
    throw new BadRequestError('pathParameters should not be empty');
  switch (event.httpMethod) {
    case 'PUT':
      if (event.body === null)
        throw new BadRequestError('body should not be empty');

      return service.updateBill(
        event.pathParameters.id,
        event.pathParameters.billId,
        JSON.parse(event.body) as PutBookBillRequest,
        event.headers as AuthHeaders
      );
    case 'DELETE':
      return service.deleteBill(
        event.pathParameters.id,
        event.pathParameters.billId,
        event.headers as AuthHeaders
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

      return service.addMember(
        event.pathParameters.id,
        JSON.parse(event.body) as PostBookMemberRequest,
        event.headers as AuthHeaders
      );
    default:
      throw new InternalServerError('unknown http method');
  }
}

async function apiBookIdMemberId(event: LambdaEvent, service: BookService) {
  if (event.pathParameters === null)
    throw new BadRequestError('pathParameters should not be empty');
  switch (event.httpMethod) {
    case 'PUT':
      if (event.body === null)
        throw new BadRequestError('body should not be empty');

      return service.reviseMemberNickname(
        event.pathParameters.id,
        event.pathParameters.mid,
        JSON.parse(event.body) as PutBookMemberRequest,
        event.headers as AuthHeaders
      );
    case 'DELETE':
      return service.deleteMember(
        event.pathParameters.id,
        event.pathParameters.mid,
        event.headers as AuthHeaders
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

      return service.addTransfer(
        event.pathParameters.id,
        JSON.parse(event.body) as PostBookTransferRequest,
        event.headers as AuthHeaders
      );
    default:
      throw new InternalServerError('unknown http method');
  }
}

async function apiBookIdTransferId(event: LambdaEvent, service: BookService) {
  if (event.pathParameters === null)
    throw new BadRequestError('pathParameters should not be empty');
  switch (event.httpMethod) {
    case 'PUT':
      if (event.body === null)
        throw new BadRequestError('body should not be empty');

      return service.updateTransfer(
        event.pathParameters.id,
        event.pathParameters.tid,
        JSON.parse(event.body) as PutBookTransferRequest,
        event.headers as AuthHeaders
      );
    case 'DELETE':
      return service.deleteTransfer(
        event.pathParameters.id,
        event.pathParameters.tid,
        event.headers as AuthHeaders
      );
    default:
      throw new InternalServerError('unknown http method');
  }
}
