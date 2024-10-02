import axios from 'axios';
import { inject, injectable } from 'inversify';
import { BankAccess } from 'src/access/BankAccess';
import { BankEntity } from 'src/model/entity/BankEntity';

/**
 * Service class for Bank
 */
@injectable()
export class BankService {
  @inject(BankAccess)
  private readonly bankAccess!: BankAccess;

  public async syncBankData() {
    // clean existing bank
    await this.bankAccess.hardDeleteAll();

    // get bank list and save
    const response = await axios.get<string>(
      'https://www.fisc.com.tw/TC/OPENDATA/R2_Location.csv',
      {
        headers: {
          'content-type': 'text/plain;',
        },
      }
    );
    const text = response.data;
    const arr = text.split('\n');
    arr.shift();
    arr.pop();

    const bankSet = new Set<string>();
    const bankEnities: BankEntity[] = [];

    for (const data of arr) {
      const bankCode = data.split(',')[0];
      const bankName = data.split(',')[2];
      if (data.split(',')[3] === '') continue;
      if (!bankSet.has(bankCode)) {
        bankSet.add(bankCode);
        const newBank = new BankEntity();
        newBank.code = bankCode;
        newBank.name = bankName;
        bankEnities.push(newBank);
      }
    }
    await this.bankAccess.saveMany(bankEnities);
  }
}
