import { Container } from 'inversify';
import 'reflect-metadata';
import { BillAccess } from './access/BillAccess';
import { BillShareAccess } from './access/BillShareAccess';
import { BookAccess } from './access/BookAccess';
import { DbAccess } from './access/DbAccess';
import { DeviceBookAccess } from './access/DeviceBookAccess';
import { DeviceTokenAccess } from './access/DeviceTokenAccess';
import { MemberAccess } from './access/MemberAccess';
import { TransferAccess } from './access/TransferAccess';
import { ViewBillShareAccess } from './access/ViewBillShareAccess';
import { ViewBookAccess } from './access/ViewBookAccess';
import { ViewDeviceBookAccess } from './access/ViewDeviceBookAccess';
import { ViewTransactionAccess } from './access/ViewTransactionAccess';
import { BookService } from './logic/BookService';
import { DbCleanService } from './logic/DbCleanService';
import { TransferService } from './logic/TransferService';
import { BillEntity } from './model/entity/BillEntity';
import { BillShareEntity } from './model/entity/BillShareEntity';
import { BookEntity } from './model/entity/BookEntity';
import { DeviceBookEntity } from './model/entity/DeviceBookEntity';
import { DeviceTokenEntity } from './model/entity/DeviceTokenEntity';
import { MemberEntity } from './model/entity/MemberEntity';
import { TransferEntity } from './model/entity/TransferEntity';
import { ViewBillShareEntity } from './model/viewEntity/ViewBillShareEntity';
import { ViewBookEntity } from './model/viewEntity/ViewBookEntity';
import { ViewDeviceBookEntity } from './model/viewEntity/ViewDeviceBookEntity';
import { ViewTransactionEntity } from './model/viewEntity/ViewTransactionEntity';
import { Database, dbEntitiesBindingId } from './util/Database';
import { CurrencyEntity } from './model/entity/CurrencyEntity';
import { MemberSettlementEntity } from './model/entity/MemberSettlementEntity';
import { CurrencyAccess } from './access/CurrencyAccess';
import { MemberSettlementAccess } from './access/MemberSettlementAccess';

const container: Container = new Container();

container.bind<Database>(Database).toSelf().inSingletonScope();

// bind repeatedly for db entities
container.bind<Function>(dbEntitiesBindingId).toFunction(BillEntity);
container.bind<Function>(dbEntitiesBindingId).toFunction(BillShareEntity);
container.bind<Function>(dbEntitiesBindingId).toFunction(BookEntity);
container.bind<Function>(dbEntitiesBindingId).toFunction(CurrencyEntity);
container.bind<Function>(dbEntitiesBindingId).toFunction(DeviceBookEntity);
container.bind<Function>(dbEntitiesBindingId).toFunction(DeviceTokenEntity);
container.bind<Function>(dbEntitiesBindingId).toFunction(MemberEntity);
container.bind<Function>(dbEntitiesBindingId).toFunction(MemberSettlementEntity);
container.bind<Function>(dbEntitiesBindingId).toFunction(TransferEntity);
container.bind<Function>(dbEntitiesBindingId).toFunction(ViewDeviceBookEntity);
container.bind<Function>(dbEntitiesBindingId).toFunction(ViewBillShareEntity);
container.bind<Function>(dbEntitiesBindingId).toFunction(ViewBookEntity);
container.bind<Function>(dbEntitiesBindingId).toFunction(ViewTransactionEntity);

// db access for tables
container.bind<DbAccess>(DbAccess).toSelf();
container.bind<BillAccess>(BillAccess).toSelf();
container.bind<BillShareAccess>(BillShareAccess).toSelf();
container.bind<BookAccess>(BookAccess).toSelf();
container.bind<CurrencyAccess>(CurrencyAccess).toSelf();
container.bind<DeviceBookAccess>(DeviceBookAccess).toSelf();
container.bind<DeviceTokenAccess>(DeviceTokenAccess).toSelf();
container.bind<MemberAccess>(MemberAccess).toSelf();
container.bind<MemberSettlementAccess>(MemberSettlementAccess).toSelf();
container.bind<TransferAccess>(TransferAccess).toSelf();
container.bind<ViewDeviceBookAccess>(ViewDeviceBookAccess).toSelf();
container.bind<ViewBillShareAccess>(ViewBillShareAccess).toSelf();
container.bind<ViewBookAccess>(ViewBookAccess).toSelf();
container.bind<ViewTransactionAccess>(ViewTransactionAccess).toSelf();

// service
container.bind<BookService>(BookService).toSelf();
container.bind<DbCleanService>(DbCleanService).toSelf();
container.bind<TransferService>(TransferService).toSelf();

export { container as bindings };
