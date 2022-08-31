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
  PostBookRequest,
  PostBookResponse,
  PutBookRequest,
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
