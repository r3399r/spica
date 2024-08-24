import { bindings } from 'src/bindings';
import { DbCleanService } from 'src/logic/DbCleanService';

export async function dbClean() {
  let service: DbCleanService | null = null;
  service = bindings.get(DbCleanService);
  await service.cleanExpired();
}
