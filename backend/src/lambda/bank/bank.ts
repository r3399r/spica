import { bindings } from 'src/bindings';
import { BankService } from 'src/logic/BankService';

export async function bank(_event: unknown, _context: unknown) {
  let service: BankService | null = null;
  try {
    service = bindings.get(BankService);
    await service.syncBankData();
  } finally {
    await service?.cleanup();
  }
}
