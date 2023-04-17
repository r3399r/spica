import { bindings } from 'src/bindings';
import { TransferService } from 'src/logic/TransferService';
import { PutTransferRequest } from 'src/model/api/Transfer';
import { BadRequestError, InternalServerError } from 'src/model/error';
import { LambdaContext, LambdaEvent, LambdaOutput } from 'src/model/Lambda';
import { errorOutput, successOutput } from 'src/util/LambdaOutput';

export async function transfer(
  event: LambdaEvent,
  _context?: LambdaContext
): Promise<LambdaOutput> {
  let service: TransferService | null = null;
  try {
    service = bindings.get(TransferService);

    let res: unknown;

    switch (event.resource) {
      case '/api/transfer':
        res = await apiTransfer(event, service);
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

async function apiTransfer(event: LambdaEvent, service: TransferService) {
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
