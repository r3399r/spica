import { Container } from 'inversify';
import 'reflect-metadata';
import { BookAccess } from './access/BookAccess';
import { MemberAccess } from './access/MemberAccess';
import { BookService } from './logic/BookService';
import { BookEntity } from './model/entity/BookEntity';
import { MemberEntity } from './model/entity/MemberEntity';
import { Database, dbEntitiesBindingId } from './util/Database';

const container: Container = new Container();

container.bind<Database>(Database).toSelf().inSingletonScope();

// bind repeatedly for db entities
container.bind<Function>(dbEntitiesBindingId).toFunction(BookEntity);
container.bind<Function>(dbEntitiesBindingId).toFunction(MemberEntity);

// db access for tables
container.bind<BookAccess>(BookAccess).toSelf();
container.bind<MemberAccess>(MemberAccess).toSelf();

// service
container.bind<BookService>(BookService).toSelf();

export { container as bindings };
