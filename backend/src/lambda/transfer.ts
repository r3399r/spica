import { bindings } from 'src/bindings';
import { TransferService } from 'src/logic/TransferService';
import { PutTransferRequest } from 'src/model/api/Transfer';
import { BadRequestError, InternalServerError } from 'src/model/error';
import { LambdaContext, LambdaEvent } from 'src/model/Lambda';

let event: LambdaEvent;
let service: TransferService;

export async function transfer(
  lambdaEvent: LambdaEvent,
  _context?: LambdaContext
) {
  event = lambdaEvent;
  service = bindings.get(TransferService);

  switch (event.resource) {
    case '/api/transfer':
      return await apiTransfer();
  }
  throw new InternalServerError('unknown resource');
}

async function apiTransfer() {
  if (event.headers === null)
    throw new BadRequestError('headers should not be empty');
  switch (event.httpMethod) {
    case 'POST':
      return service.getToken(event.headers['x-api-device']);
    case 'PUT':
      if (event.body === null)
        throw new BadRequestError('body should not be empty');

      return service.transferDevice(
        JSON.parse(event.body) as PutTransferRequest,
        event.headers['x-api-device']
      );
    default:
      throw new InternalServerError('unknown http method');
  }
}
