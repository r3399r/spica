import { inject, injectable } from 'inversify';
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
}
