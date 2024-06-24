import { bindings } from 'src/bindings';
import { BankAccountService } from 'src/logic/BankAccountService';
import {
  PostBankAccountRequest,
  PutBankAccountRequest,
} from 'src/model/api/BankAccount';
import { BadRequestError, InternalServerError } from 'src/model/error';
import { LambdaContext, LambdaEvent, LambdaOutput } from 'src/model/Lambda';
import { errorOutput, successOutput } from 'src/util/LambdaOutput';

export async function bankAccount(
  event: LambdaEvent,
  _context?: LambdaContext
): Promise<LambdaOutput> {
  let service: BankAccountService | null = null;
  try {
    service = bindings.get(BankAccountService);

    let res: unknown;

    switch (event.resource) {
      case '/api/bankAccount':
        res = await apiBankAccount(event, service);
        break;
      case '/api/bankAccount/{id}':
        res = await apiBankAccountId(event, service);
        break;
      case '/api/bankAccount/bank':
        res = await apiBankAccountBank(event, service);
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

async function apiBankAccount(event: LambdaEvent, service: BankAccountService) {
  if (event.headers === null)
    throw new BadRequestError('headers should not be empty');
  switch (event.httpMethod) {
    case 'GET':
      return service.getBankAccount(event.headers['x-api-device']);
    case 'POST':
      if (event.body === null)
        throw new BadRequestError('body should not be empty');

      return service.createBankAccount(
        JSON.parse(event.body) as PostBankAccountRequest,
        event.headers['x-api-device']
      );
    default:
      throw new InternalServerError('unknown http method');
  }
}

async function apiBankAccountId(
  event: LambdaEvent,
  service: BankAccountService
) {
  if (event.pathParameters === null)
    throw new BadRequestError('pathParameters should not be empty');
  if (event.headers === null)
    throw new BadRequestError('headers should not be empty');
  switch (event.httpMethod) {
    case 'PUT':
      if (event.body === null)
        throw new BadRequestError('body should not be empty');

      return service.updateBankAccount(
        event.pathParameters.id,
        JSON.parse(event.body) as PutBankAccountRequest,
        event.headers['x-api-device']
      );
    case 'DELETE':
      return service.deleteBankAccount(
        event.pathParameters.id,
        event.headers['x-api-device']
      );
    default:
      throw new InternalServerError('unknown http method');
  }
}

async function apiBankAccountBank(
  event: LambdaEvent,
  service: BankAccountService
) {
  switch (event.httpMethod) {
    case 'GET':
      return service.getBankList();
    default:
      throw new InternalServerError('unknown http method');
  }
}
