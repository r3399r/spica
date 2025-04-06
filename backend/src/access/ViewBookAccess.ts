import { inject, injectable } from 'inversify';
import { In, Raw } from 'typeorm';
import { ViewBook } from 'src/model/viewEntity/ViewBook';
import { ViewBookEntity } from 'src/model/viewEntity/ViewBookEntity';
import { Database } from 'src/util/Database';

/**
 * Access class for ViewBook model.
 */
@injectable()
export class ViewBookAccess {
  @inject(Database)
  private readonly database!: Database;

  public async findExpired() {
    const qr = await this.database.getQueryRunner();

    return await qr.manager.find<ViewBook>(ViewBookEntity.name, {
      where: {
        lastDateUpdated: Raw((alias) => `${alias} < NOW() - interval '1 year'`),
      },
    });
  }

  public async findById(id: string) {
    const qr = await this.database.getQueryRunner();

    return await qr.manager.findOne<ViewBook>(ViewBookEntity.name, {
      where: { id },
    });
  }

  public async findByIds(ids: string[]) {
    const qr = await this.database.getQueryRunner();

    return await qr.manager.find<ViewBook>(ViewBookEntity.name, {
      where: { id: In(ids) },
    });
  }
}
