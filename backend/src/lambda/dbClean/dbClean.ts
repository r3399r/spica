import { bindings } from 'src/bindings';
import { DbCleanService } from 'src/logic/DbCleanService';

export async function dbClean(_event: unknown, _context: unknown) {
  let service: DbCleanService | null = null;
  try {
    service = bindings.get(DbCleanService);
  } finally {
    await service?.cleanup();
  }
}
