import { inject, injectable } from 'inversify';
import { FindManyOptions, FindOneOptions, ObjectLiteral } from 'typeorm';
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

  public async remove(options: FindManyOptions<MemberSettlement>) {
    const qr = await this.database.getQueryRunner();
    const res = await qr.manager.find(MemberSettlementEntity.name, options);
    await qr.manager.remove(res);
  }

  private async executeDelete(where: string, parameters?: ObjectLiteral) {
    const qb = await this.database.getQueryBuilder();
    await qb
      .delete()
      .from(MemberSettlementEntity.name)
      .where(where, parameters)
      .execute();
  }

  public async hardDeleteByCurrencyIds(ids: string[]) {
    await this.executeDelete('currency_id IN (:...ids)', { ids });
  }
}
