import { BadRequestError } from '@y-celestial/service';
import { inject, injectable } from 'inversify';
import { Member } from 'src/model/entity/Member';
import { MemberEntity } from 'src/model/entity/MemberEntity';
import { Database } from 'src/util/Database';

/**
 * Access class for Member model.
 */
@injectable()
export class MemberAccess {
  @inject(Database)
  private readonly database!: Database;

  public async findById(id: string) {
    const qr = await this.database.getQueryRunner();

    return await qr.manager.findOneByOrFail<Member>(MemberEntity.name, { id });
  }

  public async save(member: Member) {
    const qr = await this.database.getQueryRunner();
    const entity = new MemberEntity();
    Object.assign(entity, member);

    return await qr.manager.save(entity);
  }

  public async update(member: Member) {
    const qr = await this.database.getQueryRunner();
    const entity = new MemberEntity();
    Object.assign(entity, member);

    const res = await qr.manager.update(MemberEntity, member.id, entity);

    if (res.affected === 0) throw new BadRequestError('nothing happened.');
  }

  public async hardDeleteById(id: string) {
    const qr = await this.database.getQueryRunner();

    const res = await qr.manager.delete(MemberEntity.name, id);

    if (res.affected === 0) throw new BadRequestError('nothing happened.');
  }
}
