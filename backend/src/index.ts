import { LambdaContext, LambdaEvent } from 'src/model/Lambda';
import { DbAccess } from './access/DbAccess';
import { bindings } from './bindings';
import { bank } from './lambda/bank';
import { bankAccount } from './lambda/bankAccount';
import { book } from './lambda/book';
import { dataSync } from './lambda/dataSync';
import { dbClean } from './lambda/dbClean';
import { manifest } from './lambda/manifest';
import { transfer } from './lambda/transfer';
import { errorOutput, successOutput } from './util/LambdaOutput';

export const api = async (event: LambdaEvent, _context?: LambdaContext) => {
  console.log(event);
  const db = bindings.get(DbAccess);
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
    }

    const output = successOutput(res);
    await db.commitTransaction();

    return output;
  } catch (e) {
    console.log(e);
    await db.rollbackTransaction();

    return errorOutput(e);
  } finally {
    await db.cleanup();
  }
};

export async function eventBridgeDbClean(_event: unknown, _context: unknown) {
  const db = bindings.get(DbAccess);
  await db.startTransaction();
  try {
    await dbClean();
    await db.commitTransaction();
    await db.resetSqlStats();
  } catch (e) {
    console.log(e);
    await db.rollbackTransaction();
  } finally {
    await db.cleanup();
  }
}

export async function eventBridgebank(_event: unknown, _context: unknown) {
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
