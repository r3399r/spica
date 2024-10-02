import { inject, injectable } from 'inversify';
import { FindManyOptions } from 'typeorm';
import { Member } from 'src/model/entity/Member';
import { MemberEntity } from 'src/model/entity/MemberEntity';
import { InternalServerError } from 'src/model/error';
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

  public async findByBookId(bookId: string) {
    const qr = await this.database.getQueryRunner();

    return await qr.manager.find<Member>(MemberEntity.name, {
      where: { bookId },
    });
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

    if (res.affected === 0) throw new InternalServerError('nothing happened.');
  }

  public async hardDelete(options: FindManyOptions<Member>) {
    const qr = await this.database.getQueryRunner();
    const res = await qr.manager.find(MemberEntity.name, options);
    await qr.manager.remove(res);
  }
}
