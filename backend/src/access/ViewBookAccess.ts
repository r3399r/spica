import { inject, injectable } from 'inversify';
import { FindManyOptions, FindOneOptions, In, Raw } from 'typeorm';
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

  private async findOne(options?: FindOneOptions<ViewBook>) {
    const qr = await this.database.getQueryRunner();

    return await qr.manager.findOne<ViewBook>(ViewBookEntity.name, {
      ...options,
    });
  }

  private async find(options?: FindManyOptions<ViewBook>) {
    const qr = await this.database.getQueryRunner();

    return await qr.manager.find<ViewBook>(ViewBookEntity.name, {
      ...options,
    });
  }

  public async findExpired() {
    return await this.find({
      where: {
        lastDateUpdated: Raw((alias) => `${alias} < NOW() - interval '1 year'`),
      },
    });
  }

  public async findById(id: string) {
    return await this.findOne({
      where: { id },
    });
  }

  public async findByIds(ids: string[]) {
    return await this.find({
      where: { id: In(ids) },
    });
  }
}
