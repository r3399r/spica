import axios from 'axios';
import { inject, injectable } from 'inversify';
import { BankAccess } from 'src/access/BankAccess';
import { DbAccess } from 'src/access/DbAccess';
import { BankEntity } from 'src/model/entity/BankEntity';

/**
 * Service class for Bank
 */
@injectable()
export class BankService {
  @inject(DbAccess)
  private readonly dbAccess!: DbAccess;

  @inject(BankAccess)
  private readonly bankAccess!: BankAccess;

  public async cleanup() {
    await this.dbAccess.cleanup();
  }

  public async syncBankData() {
    try {
      await this.dbAccess.startTransaction();

      // clean existing bank
      const banks = await this.bankAccess.find();
      for (const bank of banks) await this.bankAccess.hardDeleteById(bank.id);

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

      for (const data of arr) {
        const bankCode = data.split(',')[0];
        const bankName = data.split(',')[2];
        if (data.split(',')[3] === '') continue;
        if (!bankSet.has(bankCode)) {
          bankSet.add(bankCode);
          const newBank = new BankEntity();
          newBank.code = bankCode;
          newBank.name = bankName;
          await this.bankAccess.save(newBank);
        }
      }

      await this.dbAccess.commitTransaction();
    } catch (e) {
      await this.dbAccess.rollbackTransaction();
      throw e;
    }
  }
}
