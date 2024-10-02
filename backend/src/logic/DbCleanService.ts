import { inject, injectable } from 'inversify';
import { In } from 'typeorm';
import { BillAccess } from 'src/access/BillAccess';
import { BillShareAccess } from 'src/access/BillShareAccess';
import { BookAccess } from 'src/access/BookAccess';
import { CurrencyAccess } from 'src/access/CurrencyAccess';
import { DeviceBookAccess } from 'src/access/DeviceBookAccess';
import { DeviceTokenAccess } from 'src/access/DeviceTokenAccess';
import { MemberAccess } from 'src/access/MemberAccess';
import { MemberSettlementAccess } from 'src/access/MemberSettlementAccess';
import { TransferAccess } from 'src/access/TransferAccess';
import { ViewBookAccess } from 'src/access/ViewBookAccess';

/**
 * Service class for DbClean
 */
@injectable()
export class DbCleanService {
  @inject(ViewBookAccess)
  private readonly vBookAccess!: ViewBookAccess;

  @inject(TransferAccess)
  private readonly transferAccess!: TransferAccess;

  @inject(BillAccess)
  private readonly billAccess!: BillAccess;

  @inject(BillShareAccess)
  private readonly billShareAccess!: BillShareAccess;

  @inject(MemberAccess)
  private readonly memberAccess!: MemberAccess;

  @inject(MemberSettlementAccess)
  private readonly memberSettlementAccess!: MemberSettlementAccess;

  @inject(CurrencyAccess)
  private readonly currencyAccess!: CurrencyAccess;

  @inject(BookAccess)
  private readonly bookAccess!: BookAccess;

  @inject(DeviceBookAccess)
  private readonly deviceBookAccess!: DeviceBookAccess;

  @inject(DeviceTokenAccess)
  private readonly deviceTokenAccess!: DeviceTokenAccess;

  private async cleanExpiredBook() {
    const res = await this.vBookAccess.findExpired();

    for (const book of res) {
      // delete member_settlement
      const currencies = await this.currencyAccess.findByBookId(book.id);
      const currencyIdSet = new Set(currencies.map((v) => v.id));
      await this.memberSettlementAccess.hardDelete({
        where: { currencyId: In([...currencyIdSet]) },
      });

      // delete transfer
      await this.transferAccess.hardDelete({ where: { bookId: book.id } });

      // delete bill -> billShare
      const bills = await this.billAccess.findByBookId(book.id);
      const billIdSet = new Set(bills.map((v) => v.id));
      await this.billShareAccess.hardDelete({
        where: { billId: In([...billIdSet]) },
      });
      await this.billAccess.hardDelete({ where: { bookId: book.id } });

      // delete currency
      await this.currencyAccess.hardDelete({ where: { bookId: book.id } });

      // delete member
      await this.memberAccess.hardDelete({ where: { bookId: book.id } });

      // delete device book pair
      await this.deviceBookAccess.hardDelete({ where: { bookId: book.id } });

      // delete book
      await this.bookAccess.hardDelete({ where: { id: book.id } });
    }
  }

  // deprecated
  private async cleanExpiredToken() {
    const res = await this.deviceTokenAccess.findExpired();

    for (const deviceToken of res)
      await this.deviceTokenAccess.hardDelete({
        where: { id: deviceToken.id },
      });
  }

  public async cleanExpired() {
    await this.cleanExpiredBook();
    await this.cleanExpiredToken();
  }
}
