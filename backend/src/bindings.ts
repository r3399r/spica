import { Container } from 'inversify';
import 'reflect-metadata';
import { BillAccess } from './access/BillAccess';
import { BillShareAccess } from './access/BillShareAccess';
import { BookAccess } from './access/BookAccess';
import { DbAccess } from './access/DbAccess';
import { MemberAccess } from './access/MemberAccess';
import { TransferAccess } from './access/TransferAccess';
import { ViewBookAccess } from './access/ViewBookAccess';
import { ViewTransactionAccess } from './access/ViewTransactionAccess';
import { BookService } from './logic/BookService';
import { DbCleanService } from './logic/DbCleanService';
import { BillEntity } from './model/entity/BillEntity';
import { BillShareEntity } from './model/entity/BillShareEntity';
import { BookEntity } from './model/entity/BookEntity';
import { MemberEntity } from './model/entity/MemberEntity';
import { TransferEntity } from './model/entity/TransferEntity';
import { ViewBookEntity } from './model/viewEntity/ViewBookEntity';
import { ViewTransactionEntity } from './model/viewEntity/ViewTransactionEntity';
import { Database, dbEntitiesBindingId } from './util/Database';

const container: Container = new Container();

container.bind<Database>(Database).toSelf().inSingletonScope();

// bind repeatedly for db entities
container.bind<Function>(dbEntitiesBindingId).toFunction(BillEntity);
container.bind<Function>(dbEntitiesBindingId).toFunction(BillShareEntity);
container.bind<Function>(dbEntitiesBindingId).toFunction(BookEntity);
container.bind<Function>(dbEntitiesBindingId).toFunction(MemberEntity);
container.bind<Function>(dbEntitiesBindingId).toFunction(TransferEntity);
container.bind<Function>(dbEntitiesBindingId).toFunction(ViewBookEntity);
container.bind<Function>(dbEntitiesBindingId).toFunction(ViewTransactionEntity);

// db access for tables
container.bind<DbAccess>(DbAccess).toSelf();
container.bind<BillAccess>(BillAccess).toSelf();
container.bind<BillShareAccess>(BillShareAccess).toSelf();
container.bind<BookAccess>(BookAccess).toSelf();
container.bind<MemberAccess>(MemberAccess).toSelf();
container.bind<TransferAccess>(TransferAccess).toSelf();
container.bind<ViewBookAccess>(ViewBookAccess).toSelf();
container.bind<ViewTransactionAccess>(ViewTransactionAccess).toSelf();

// service
container.bind<BookService>(BookService).toSelf();
container.bind<DbCleanService>(DbCleanService).toSelf();

export { container as bindings };
