import { inject, injectable } from 'inversify';
import { MemberSettlement } from 'src/model/entity/MemberSettlement';
import { MemberSettlementEntity } from 'src/model/entity/MemberSettlementEntity';
import { BadRequestError } from 'src/model/error';
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

  public async hardDeleteById(id: string) {
    const qr = await this.database.getQueryRunner();

    const res = await qr.manager.delete(MemberSettlementEntity.name, id);

    if (res.affected === 0) throw new BadRequestError('nothing happened.');
  }
}
