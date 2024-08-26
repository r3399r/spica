import { inject, injectable } from 'inversify';
import { FindOneOptions } from 'typeorm';
import { EmailBind } from 'src/model/entity/EmailBind';
import { EmailBindEntity } from 'src/model/entity/EmailBindEntity';
import { Database } from 'src/util/Database';

/**
 * Access class for EmailBind model.
 */
@injectable()
export class EmailBindAccess {
  @inject(Database)
  private readonly database!: Database;

  public async save(input: EmailBind) {
    const qr = await this.database.getQueryRunner();
    const entity = new EmailBindEntity();
    Object.assign(entity, input);

    return await qr.manager.save(entity);
  }

  public async findOne(options: FindOneOptions<EmailBind>) {
    const qr = await this.database.getQueryRunner();

    return await qr.manager.findOne<EmailBind>(EmailBindEntity.name, options);
  }

  public async findOneOrFail(options: FindOneOptions<EmailBind>) {
    const qr = await this.database.getQueryRunner();

    return await qr.manager.findOneOrFail<EmailBind>(
      EmailBindEntity.name,
      options
    );
  }
}
