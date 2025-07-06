import { SQS } from 'aws-sdk';
import { LambdaContext, LambdaEvent, LambdaOutput } from 'src/model/Lambda';
import { DbAccess } from './access/DbAccess';
import { bindings } from './bindings';
import { bank } from './lambda/bank';
import { bankAccount } from './lambda/bankAccount';
import { book } from './lambda/book';
import { dataSync } from './lambda/dataSync';
import { dbClean } from './lambda/dbClean';
import { exportPdf } from './lambda/exportPdf';
import { manifest } from './lambda/manifest';
import { transfer } from './lambda/transfer';
import { GatewayTimeoutError } from './model/error/5XX/GatewayTimeoutError';
import { errorOutput, successOutput } from './util/LambdaOutput';

const apiProcess = async (event: LambdaEvent): Promise<LambdaOutput> => {
  const db = bindings.get(DbAccess);
  let output: LambdaOutput;
  await db.startTransaction();
  try {
    let res: unknown;

    const resource = event.resource.split('/')[2];
    switch (resource) {
      case 'book':
        res = await book(event);
        break;
      case 'manifest':
        res = await manifest(event);
        break;
      case 'dataSync':
        res = await dataSync(event);
        break;
      case 'transfer':
        res = await transfer(event);
        break;
      case 'bankAccount':
        res = await bankAccount(event);
        break;
      case 'exportPdf':
        res = await exportPdf(event);
        break;
    }

    output = successOutput(res);
    await db.commitTransaction();
  } catch (e) {
    console.error(e);
    await db.rollbackTransaction();

    output = errorOutput(e);
  } finally {
    await db.cleanup();
  }

  return output;
};

export const api = async (
  event: LambdaEvent,
  context: LambdaContext
): Promise<LambdaOutput> => {
  console.log(event);

  const startTime = Date.now();

  const output = await Promise.race([
    apiProcess(event),
    new Promise<LambdaOutput>((resolve) =>
      setTimeout(
        () => resolve(errorOutput(new GatewayTimeoutError('Gateway Timeout'))),
        context.getRemainingTimeInMillis() - 2000
      )
    ),
  ]);

  // logger sqs
  const sqs = bindings.get(SQS);
  try {
    await sqs
      .sendMessage({
        MessageBody: JSON.stringify({
          project: process.env.PROJECT ?? '',
          resource: event.resource,
          path: event.path,
          httpMethod: event.httpMethod,
          queryStringParameters: event.queryStringParameters
            ? JSON.stringify(event.queryStringParameters)
            : null,
          body: event.body,
          elapsedTime: Date.now() - startTime,
          statusCode: output.statusCode,
          dateRequested: new Date().toISOString(),
          version: event.headers
            ? (event.headers['x-api-version'] ?? null)
            : null,
          ip: event.requestContext.identity.sourceIp,
        }),
        QueueUrl: process.env.LOGGER_QUEUE_URL ?? '',
      })
      .promise();
  } catch (e) {
    console.error(e);
  }

  return output;
};

export async function eventBridgeDbClean(_event: unknown, _context: unknown) {
  const db = bindings.get(DbAccess);
  await db.startTransaction();
  try {
    await dbClean();
    await db.commitTransaction();
  } catch (e) {
    console.log(e);
    await db.rollbackTransaction();
  } finally {
    await db.cleanup();
  }
}

export async function eventBridgeBank(_event: unknown, _context: unknown) {
  const db = bindings.get(DbAccess);
  await db.startTransaction();
  try {
    await bank();
    await db.commitTransaction();
  } catch (e) {
    console.log(e);
    await db.rollbackTransaction();
  } finally {
    await db.cleanup();
  }
}
