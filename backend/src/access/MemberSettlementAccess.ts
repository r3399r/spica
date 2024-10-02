import { inject, injectable } from 'inversify';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { MemberSettlement } from 'src/model/entity/MemberSettlement';
import { MemberSettlementEntity } from 'src/model/entity/MemberSettlementEntity';
import { Database } from 'src/util/Database';

/**
 * Access class for MemberSettlement model.
 */
@injectable()
export class MemberSettlementAccess {
  @inject(Database)
  private readonly database!: Database;

  public async save(memberSettlement: MemberSettlement) {
    const qr = await this.database.getQueryRunner();
    const entity = new MemberSettlementEntity();
    Object.assign(entity, memberSettlement);

    return await qr.manager.save(entity);
  }

  public async findByCurrencyId(currencyId: string) {
    const qr = await this.database.getQueryRunner();

    return await qr.manager.find<MemberSettlement>(
      MemberSettlementEntity.name,
      {
        where: { currencyId },
      }
    );
  }

  public async findOneOrFail(options?: FindOneOptions<MemberSettlement>) {
    const qr = await this.database.getQueryRunner();

    return await qr.manager.findOneOrFail<MemberSettlement>(
      MemberSettlementEntity.name,
      {
        ...options,
      }
    );
  }

  public async find(options?: FindManyOptions<MemberSettlement>) {
    const qr = await this.database.getQueryRunner();

    return await qr.manager.find<MemberSettlement>(
      MemberSettlementEntity.name,
      {
        relations: { currency: true },
        ...options,
      }
    );
  }

  public async hardDelete(options: FindManyOptions<MemberSettlement>) {
    const qr = await this.database.getQueryRunner();
    const res = await qr.manager.find(MemberSettlementEntity.name, options);
    await qr.manager.remove(res);
  }
}
