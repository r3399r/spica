import { bindings } from 'src/bindings';
import { BankService } from 'src/logic/BankService';

export async function bank() {
  let service: BankService | null = null;
  service = bindings.get(BankService);
  await service.syncBankData();
}
