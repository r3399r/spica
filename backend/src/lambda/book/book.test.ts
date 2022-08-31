import {
  BadRequestError,
  errorOutput,
  InternalServerError,
  LambdaContext,
  LambdaEvent,
  successOutput,
} from '@y-celestial/service';
import { bindings } from 'src/bindings';
import { BookService } from 'src/logic/BookService';
import { book } from './book';

/**
 * Tests of book lambda function
 */
describe('book', () => {
  let event: LambdaEvent;
  let lambdaContext: LambdaContext | undefined;
  let mockBookService: any;

  beforeEach(() => {
    lambdaContext = { awsRequestId: '456' };

    mockBookService = {};
    bindings.rebind<BookService>(BookService).toConstantValue(mockBookService);

    mockBookService.createBook = jest.fn();
    mockBookService.cleanup = jest.fn();
  });

  describe('/api/book', () => {
    it('POST should work', async () => {
      event = {
        resource: '/api/book',
        httpMethod: 'POST',
        headers: null,
        body: JSON.stringify({ a: '1' }),
        pathParameters: null,
        queryStringParameters: null,
        requestContext: {},
      };
      await expect(book(event, lambdaContext)).resolves.toStrictEqual(
        successOutput(undefined)
      );
      expect(mockBookService.createBook).toBeCalledTimes(1);
    });

    it('POST should fail without body', async () => {
      event = {
        resource: '/api/book',
        httpMethod: 'POST',
        headers: null,
        body: null,
        pathParameters: null,
        queryStringParameters: null,
        requestContext: {},
      };
      await expect(book(event, lambdaContext)).resolves.toStrictEqual(
        errorOutput(new BadRequestError('body should not be empty'))
      );
    });

    it('unknown http method should fail', async () => {
      event = {
        resource: '/api/book',
        httpMethod: 'XXX',
        headers: null,
        body: JSON.stringify({ a: '1' }),
        pathParameters: null,
        queryStringParameters: null,
        requestContext: {},
      };
      await expect(book(event, lambdaContext)).resolves.toStrictEqual(
        errorOutput(new InternalServerError('unknown http method'))
      );
    });
  });

  it('unknown resource should fail', async () => {
    event.resource = 'resource';
    await expect(book(event, lambdaContext)).resolves.toStrictEqual(
      errorOutput(new InternalServerError('unknown resource'))
    );
  });
});
