import { inject, injectable } from 'inversify';
import { DbAccess } from 'src/access/DbAccess';
import { ViewLastUpdateAccess } from 'src/access/ViewLastUpdateAccess';

/**
 * Service class for DbClean
 */
@injectable()
export class DbCleanService {
  @inject(DbAccess)
  private readonly dbAccess!: DbAccess;

  @inject(ViewLastUpdateAccess)
  private readonly vLastUpdateAccess!: ViewLastUpdateAccess;

  public async cleanup() {
    await this.dbAccess.cleanup();
  }

  public async cleanExpiredBook() {
    const res = await this.vLastUpdateAccess.findAll();
    for (const book of res)
      if (
        new Date().getTime() - book.dateLastUpdate.getTime() >
        90 * 24 * 60 * 60 * 1000
      ) {
        // delete transfer
        // delete bill -> billShare
        // delete member
        // delete book
      }
  }
}
