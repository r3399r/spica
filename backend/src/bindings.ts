import { Container } from 'inversify';
import 'reflect-metadata';
import { BookAccess } from './access/BookAccess';
import { BookService } from './logic/BookService';
import { BookEntity } from './model/entity/BookEntity';
import { Database, dbEntitiesBindingId } from './util/Database';

const container: Container = new Container();

container.bind<Database>(Database).toSelf().inSingletonScope();

// bind repeatedly for db entities
container.bind<Function>(dbEntitiesBindingId).toFunction(BookEntity);

// db access for tables
container.bind<BookAccess>(BookAccess).toSelf();

// service
container.bind<BookService>(BookService).toSelf();

export { container as bindings };
