import 'reflect-metadata';
import { SES } from 'aws-sdk';
import { Container } from 'inversify';
import { BankAccess } from './access/BankAccess';
import { BankAccountAccess } from './access/BankAccountAccess';
import { BillAccess } from './access/BillAccess';
import { BillShareAccess } from './access/BillShareAccess';
import { BookAccess } from './access/BookAccess';
import { CurrencyAccess } from './access/CurrencyAccess';
import { DbAccess } from './access/DbAccess';
import { DeviceBookAccess } from './access/DeviceBookAccess';
import { DeviceTokenAccess } from './access/DeviceTokenAccess';
import { MemberAccess } from './access/MemberAccess';
import { MemberSettlementAccess } from './access/MemberSettlementAccess';
import { SyncCodeAccess } from './access/SyncCodeAccess';
import { TransferAccess } from './access/TransferAccess';
import { ViewBillShareAccess } from './access/ViewBillShareAccess';
import { ViewBookAccess } from './access/ViewBookAccess';
import { ViewDeviceBookAccess } from './access/ViewDeviceBookAccess';
import { ViewTransactionAccess } from './access/ViewTransactionAccess';
import { BankAccountService } from './logic/BankAccountService';
import { BankService } from './logic/BankService';
import { BookService } from './logic/BookService';
import { DataSyncService } from './logic/DataSyncService';
import { DbCleanService } from './logic/DbCleanService';
import { TransferService } from './logic/TransferService';
import { BankAccountEntity } from './model/entity/BankAccountEntity';
import { BankEntity } from './model/entity/BankEntity';
import { BillEntity } from './model/entity/BillEntity';
import { BillShareEntity } from './model/entity/BillShareEntity';
import { BookEntity } from './model/entity/BookEntity';
import { CurrencyEntity } from './model/entity/CurrencyEntity';
import { DeviceBookEntity } from './model/entity/DeviceBookEntity';
import { DeviceTokenEntity } from './model/entity/DeviceTokenEntity';
import { MemberEntity } from './model/entity/MemberEntity';
import { MemberSettlementEntity } from './model/entity/MemberSettlementEntity';
import { SyncCodeEntity } from './model/entity/SyncCodeEntity';
import { TransferEntity } from './model/entity/TransferEntity';
import { ViewBillShareEntity } from './model/viewEntity/ViewBillShareEntity';
import { ViewBookEntity } from './model/viewEntity/ViewBookEntity';
import { ViewDeviceBookEntity } from './model/viewEntity/ViewDeviceBookEntity';
import { ViewTransactionEntity } from './model/viewEntity/ViewTransactionEntity';
import { Database, dbEntitiesBindingId } from './util/Database';

const container: Container = new Container();

container.bind<Database>(Database).toSelf().inSingletonScope();

// bind repeatedly for db entities
container.bind<Function>(dbEntitiesBindingId).toFunction(BankEntity);
container.bind<Function>(dbEntitiesBindingId).toFunction(BankAccountEntity);
container.bind<Function>(dbEntitiesBindingId).toFunction(BillEntity);
container.bind<Function>(dbEntitiesBindingId).toFunction(BillShareEntity);
container.bind<Function>(dbEntitiesBindingId).toFunction(BookEntity);
container.bind<Function>(dbEntitiesBindingId).toFunction(CurrencyEntity);
container.bind<Function>(dbEntitiesBindingId).toFunction(DeviceBookEntity);
container.bind<Function>(dbEntitiesBindingId).toFunction(DeviceTokenEntity);
container.bind<Function>(dbEntitiesBindingId).toFunction(MemberEntity);
container
  .bind<Function>(dbEntitiesBindingId)
  .toFunction(MemberSettlementEntity);
container.bind<Function>(dbEntitiesBindingId).toFunction(SyncCodeEntity);
container.bind<Function>(dbEntitiesBindingId).toFunction(TransferEntity);
container.bind<Function>(dbEntitiesBindingId).toFunction(ViewDeviceBookEntity);
container.bind<Function>(dbEntitiesBindingId).toFunction(ViewBillShareEntity);
container.bind<Function>(dbEntitiesBindingId).toFunction(ViewBookEntity);
container.bind<Function>(dbEntitiesBindingId).toFunction(ViewTransactionEntity);

// db access for tables
container.bind<DbAccess>(DbAccess).toSelf();
container.bind<BankAccess>(BankAccess).toSelf();
container.bind<BankAccountAccess>(BankAccountAccess).toSelf();
container.bind<BillAccess>(BillAccess).toSelf();
container.bind<BillShareAccess>(BillShareAccess).toSelf();
container.bind<BookAccess>(BookAccess).toSelf();
container.bind<CurrencyAccess>(CurrencyAccess).toSelf();
container.bind<DeviceBookAccess>(DeviceBookAccess).toSelf();
container.bind<DeviceTokenAccess>(DeviceTokenAccess).toSelf();
container.bind<MemberAccess>(MemberAccess).toSelf();
container.bind<MemberSettlementAccess>(MemberSettlementAccess).toSelf();
container.bind<TransferAccess>(TransferAccess).toSelf();
container.bind<SyncCodeAccess>(SyncCodeAccess).toSelf();
container.bind<ViewDeviceBookAccess>(ViewDeviceBookAccess).toSelf();
container.bind<ViewBillShareAccess>(ViewBillShareAccess).toSelf();
container.bind<ViewBookAccess>(ViewBookAccess).toSelf();
container.bind<ViewTransactionAccess>(ViewTransactionAccess).toSelf();

// service
container.bind<BookService>(BookService).toSelf();
container.bind<DbCleanService>(DbCleanService).toSelf();
container.bind<DataSyncService>(DataSyncService).toSelf();
container.bind<TransferService>(TransferService).toSelf();
container.bind<BankAccountService>(BankAccountService).toSelf();
container.bind<BankService>(BankService).toSelf();

// AWS
container.bind<SES>(SES).toDynamicValue(() => new SES());

export { container as bindings };
