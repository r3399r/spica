import { addDays } from 'date-fns';
import { inject, injectable } from 'inversify';
import { DeviceBookAccess } from 'src/access/DeviceBookAccess';
import { DeviceTokenAccess } from 'src/access/DeviceTokenAccess';
import {
  PostTransferResponse,
  PutTransferRequest,
} from 'src/model/api/Transfer';
import { DeviceBookEntity } from 'src/model/entity/DeviceBookEntity';
import { DeviceTokenEntity } from 'src/model/entity/DeviceTokenEntity';
import { BadRequestError } from 'src/model/error';
import { randomBase58 } from 'src/util/random';
import { differenceBy } from 'src/util/setTheory';

/**
 * Service class for Transfer
 */
@injectable()
export class TransferService {
  @inject(DeviceTokenAccess)
  private readonly deviceTokenAccess!: DeviceTokenAccess;

  @inject(DeviceBookAccess)
  private readonly deviceBookAccess!: DeviceBookAccess;

  private async generateToken(deviceId: string) {
    const deviceToken = new DeviceTokenEntity();
    deviceToken.deviceId = deviceId;
    deviceToken.token = randomBase58(20);
    deviceToken.dateExpired = addDays(new Date(), 1).toISOString();

    return await this.deviceTokenAccess.save(deviceToken);
  }

  public async getToken(deviceId: string): Promise<PostTransferResponse> {
    const unexpiredDeviceToken = await this.deviceTokenAccess.findByDeviceId(
      deviceId
    );

    return unexpiredDeviceToken ?? this.generateToken(deviceId);
  }

  public async transferDevice(data: PutTransferRequest, deviceId: string) {
    const deviceToken = await this.deviceTokenAccess.findByToken(data.token);
    if (deviceToken === null) throw new BadRequestError('bad input');

    const srcDeviceBookPairs = await this.deviceBookAccess.findByDeviceId(
      deviceToken.deviceId
    );
    const dstDeviceBookParis = await this.deviceBookAccess.findByDeviceId(
      deviceId
    );

    const diff = differenceBy(srcDeviceBookPairs, dstDeviceBookParis, 'bookId');
    for (const pair of diff) {
      const deviceBook = new DeviceBookEntity();
      deviceBook.deviceId = deviceId;
      deviceBook.bookId = pair.bookId;
      deviceBook.showDelete = false;

      await this.deviceBookAccess.save(deviceBook);
    }
  }
}
