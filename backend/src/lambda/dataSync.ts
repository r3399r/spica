import { bindings } from 'src/bindings';
import { DataSyncService } from 'src/logic/DataSyncService';
import {
  PostDataSyncBindRequest,
  PostDataSyncRequest,
} from 'src/model/api/DataSync';
import { BadRequestError, InternalServerError } from 'src/model/error';
import { LambdaContext, LambdaEvent } from 'src/model/Lambda';

let event: LambdaEvent;
let service: DataSyncService;

export async function dataSync(
  lambdaEvent: LambdaEvent,
  _context?: LambdaContext
) {
  event = lambdaEvent;
  service = bindings.get(DataSyncService);

  switch (event.resource) {
    case '/api/dataSync':
      return await apiDataSync();
    case '/api/dataSync/bind':
      return await apiDataSyncBind();
    case '/api/dataSync/unbind':
      return await apiDataSyncUnbind();
  }
  throw new InternalServerError('unknown resource');
}

async function apiDataSync() {
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

async function apiDataSyncBind() {
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

async function apiDataSyncUnbind() {
  if (event.headers === null)
    throw new BadRequestError('headers should not be empty');
  switch (event.httpMethod) {
    case 'POST':
      return service.unbindDevice(event.headers['x-api-device']);
    default:
      throw new InternalServerError('unknown http method');
  }
}
