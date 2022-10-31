import { inject, injectable } from 'inversify';
import { In } from 'typeorm';
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

  public async findAll() {
    const qr = await this.database.getQueryRunner();

    return await qr.manager.find<ViewBook>(ViewBookEntity.name);
  }

  public async findById(id: string) {
    const qr = await this.database.getQueryRunner();

    return await qr.manager.findOneByOrFail<ViewBook>(ViewBookEntity.name, {
      id,
    });
  }

  public async findByIds(ids: string[]) {
    const qr = await this.database.getQueryRunner();

    return await qr.manager.find<ViewBook>(ViewBookEntity.name, {
      where: { id: In(ids) },
    });
  }
}
