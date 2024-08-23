import { bindings } from 'src/bindings';
import { DataSyncService } from 'src/logic/DataSyncService';
import {
  PostDataSyncBindRequest,
  PostDataSyncRequest,
} from 'src/model/api/DataSync';
import { BadRequestError, InternalServerError } from 'src/model/error';
import { LambdaContext, LambdaEvent, LambdaOutput } from 'src/model/Lambda';
import { errorOutput, successOutput } from 'src/util/LambdaOutput';

export async function dataSync(
  event: LambdaEvent,
  _context?: LambdaContext
): Promise<LambdaOutput> {
  let service: DataSyncService | null = null;
  try {
    service = bindings.get(DataSyncService);

    let res: unknown;

    switch (event.resource) {
      case '/api/dataSync':
        res = await apiDataSync(event, service);
        break;
      case '/api/dataSync/bind':
        res = await apiDataSyncBind(event, service);
        break;
      case '/api/dataSync/unbind':
        res = await apiDataSyncUnbind(event, service);
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

async function apiDataSync(event: LambdaEvent, service: DataSyncService) {
  if (event.headers === null)
    throw new BadRequestError('headers should not be empty');
  switch (event.httpMethod) {
    case 'POST':
      if (event.body === null)
        throw new BadRequestError('body should not be empty');

      return service.sendEmail(
        JSON.parse(event.body) as PostDataSyncRequest,
        event.headers['x-api-device']
      );
    default:
      throw new InternalServerError('unknown http method');
  }
}

async function apiDataSyncBind(event: LambdaEvent, service: DataSyncService) {
  if (event.headers === null)
    throw new BadRequestError('headers should not be empty');
  switch (event.httpMethod) {
    case 'POST':
      if (event.body === null)
        throw new BadRequestError('body should not be empty');

      return service.bindDevice(
        JSON.parse(event.body) as PostDataSyncBindRequest,
        event.headers['x-api-device']
      );
    default:
      throw new InternalServerError('unknown http method');
  }
}

async function apiDataSyncUnbind(event: LambdaEvent, service: DataSyncService) {
  if (event.headers === null)
    throw new BadRequestError('headers should not be empty');
  switch (event.httpMethod) {
    case 'POST':
      return service.unbindDevice(event.headers['x-api-device']);
    default:
      throw new InternalServerError('unknown http method');
  }
}
