import { bindings } from 'src/bindings';
import { BankAccountService } from 'src/logic/BankAccountService';
import {
  PostBankAccountRequest,
  PutBankAccountRequest,
} from 'src/model/api/BankAccount';
import { BadRequestError, InternalServerError } from 'src/model/error';
import { LambdaContext, LambdaEvent } from 'src/model/Lambda';

let event: LambdaEvent;
let service: BankAccountService;

export async function bankAccount(
  lambdaEvent: LambdaEvent,
  _context?: LambdaContext
) {
  event = lambdaEvent;
  service = bindings.get(BankAccountService);

  switch (event.resource) {
    case '/api/bankAccount':
      return await apiBankAccount();
    case '/api/bankAccount/{id}':
      return await apiBankAccountId();
    case '/api/bankAccount/bank':
      return await apiBankAccountBank();
  }
  throw new InternalServerError('unknown resource');
}

async function apiBankAccount() {
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

async function apiBankAccountId() {
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

async function apiBankAccountBank() {
  switch (event.httpMethod) {
    case 'GET':
      return service.getBankList();
    default:
      throw new InternalServerError('unknown http method');
  }
}
