import { BadRequestError, InternalServerError } from 'src/model/error';
import { LambdaContext, LambdaEvent } from 'src/model/Lambda';

let event: LambdaEvent;

export async function exportPdf(
  lambdaEvent: LambdaEvent,
  _context?: LambdaContext
) {
  event = lambdaEvent;

  switch (event.resource) {
    case '/api/exportPdf/{id}':
      return await apiExportPdfId();
    case '/api/exportPdf/{id}/member/{mid}':
      return await apiExportPdfIdMemberMid();
  }
  throw new InternalServerError('unknown resource');
}

async function apiExportPdfId() {
  if (event.pathParameters === null)
    throw new BadRequestError('pathParameters should not be empty');
  if (event.headers === null)
    throw new BadRequestError('headers should not be empty');
  switch (event.httpMethod) {
    case 'PATCH':
      return;
    default:
      throw new InternalServerError('unknown http method');
  }
}

async function apiExportPdfIdMemberMid() {
  if (event.pathParameters === null)
    throw new BadRequestError('pathParameters should not be empty');
  if (event.headers === null)
    throw new BadRequestError('headers should not be empty');
  switch (event.httpMethod) {
    case 'PATCH':
      return;
    default:
      throw new InternalServerError('unknown http method');
  }
}
