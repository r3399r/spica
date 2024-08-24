import { inject, injectable } from 'inversify';
import { BankAccess } from 'src/access/BankAccess';
import { BankAccountAccess } from 'src/access/BankAccountAccess';
import {
  DeleteBankAccountResponse,
  GetBankAccountBankResponse,
  GetBankAccountResponse,
  PostBankAccountRequest,
  PostBankAccountResponse,
  PutBankAccountRequest,
  PutBankAccountResponse,
} from 'src/model/api/BankAccount';
import { BankAccountEntity } from 'src/model/entity/BankAccountEntity';

/**
 * Service class for BankAccount
 */
@injectable()
export class BankAccountService {
  @inject(BankAccountAccess)
  private readonly bankAccountAccess!: BankAccountAccess;

  @inject(BankAccess)
  private readonly bankAccess!: BankAccess;

  public async getBankAccount(
    deviceId: string
  ): Promise<GetBankAccountResponse> {
    return await this.bankAccountAccess.find({
      where: { deviceId },
      order: { dateCreated: 'asc' },
    });
  }

  public async getBankList(): Promise<GetBankAccountBankResponse> {
    return await this.bankAccess.find({ order: { code: 'asc' } });
  }

  public async createBankAccount(
    data: PostBankAccountRequest,
    deviceId: string
  ): Promise<PostBankAccountResponse> {
    const bankAccount = new BankAccountEntity();
    bankAccount.bankCode = data.bankCode;
    bankAccount.accountNumber = data.accountNumber;
    bankAccount.deviceId = deviceId;
    await this.bankAccountAccess.save(bankAccount);

    return await this.getBankAccount(deviceId);
  }

  public async updateBankAccount(
    id: string,
    data: PutBankAccountRequest,
    deviceId: string
  ): Promise<PutBankAccountResponse> {
    const oldBankAccount = await this.bankAccountAccess.findOneOrFail({
      where: { id, deviceId },
    });
    const newBankAccount = new BankAccountEntity();
    newBankAccount.id = oldBankAccount.id;
    newBankAccount.bankCode = data.bankCode ?? oldBankAccount.bankCode;
    newBankAccount.accountNumber =
      data.accountNumber ?? oldBankAccount.accountNumber;
    newBankAccount.deviceId = deviceId;
    await this.bankAccountAccess.save(newBankAccount);

    return await this.getBankAccount(deviceId);
  }

  public async deleteBankAccount(
    id: string,
    deviceId: string
  ): Promise<DeleteBankAccountResponse> {
    // check bank account exists and is owned by device
    await this.bankAccountAccess.findOneOrFail({ where: { id, deviceId } });
    await this.bankAccountAccess.hardDeleteById(id);

    return await this.getBankAccount(deviceId);
  }
}
