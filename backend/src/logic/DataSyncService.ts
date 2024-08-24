import { SES } from 'aws-sdk';
import { inject, injectable } from 'inversify';
import { v4 as uuidv4 } from 'uuid';
import { DeviceBookAccess } from 'src/access/DeviceBookAccess';
import { SyncCodeAccess } from 'src/access/SyncCodeAccess';
import { ErrorMessage } from 'src/constant/ErrorMessage';
import {
  PostDataSyncBindRequest,
  PostDataSyncBindResponse,
  PostDataSyncRequest,
  PostDataSyncUnbindResponse,
} from 'src/model/api/DataSync';
import { DeviceBookEntity } from 'src/model/entity/DeviceBookEntity';
import { SyncCodeEntity } from 'src/model/entity/SyncCodeEntity';
import { BadRequestError } from 'src/model/error';
import { randomBase10 } from 'src/util/random';

/**
 * Service class for DataSync
 */
@injectable()
export class DataSyncService {
  @inject(SES)
  private readonly ses!: SES;

  @inject(SyncCodeAccess)
  private readonly syncCodeAccess!: SyncCodeAccess;

  @inject(DeviceBookAccess)
  private readonly deviceBookAccess!: DeviceBookAccess;

  private getEmailBody(language: string, code: string) {
    switch (language) {
      case 'jp':
        return `こんにちは! このコードは ${code} です。`;
      case 'zh-TW':
        return `你好! 這是您的驗證碼 ${code}。`;
      case 'zh-CN':
        return `你好! 这是您的验证码 ${code}。`;
      default:
        return `Hi! This is your code, ${code}.`;
    }
  }

  private getEmailSubject(language: string) {
    switch (language) {
      case 'zh-TW':
        return 'BunnyBill - 綁定裝置';
      case 'zh-CN':
        return 'BunnyBill - 绑定装置';
      default:
        return 'BunnyBill - Bind Your Devices';
    }
  }

  public async sendEmail(data: PostDataSyncRequest, deviceId: string) {
    const syncCode = await this.syncCodeAccess.findOne({
      where: { email: data.email },
    });
    if (
      syncCode &&
      new Date().getTime() - new Date(syncCode.dateCreated).getTime() <
        5 * 60 * 1000
    )
      throw new BadRequestError(ErrorMessage.TOO_FREQUENT);

    const code = randomBase10(6);
    if (syncCode === null) {
      const newSyncCode = new SyncCodeEntity();
      newSyncCode.email = data.email;
      newSyncCode.code = code;
      newSyncCode.deviceId = deviceId;
      newSyncCode.dateCreated = new Date().toISOString();
      await this.syncCodeAccess.save(newSyncCode);
    } else {
      syncCode.code = code;
      syncCode.dateCreated = new Date().toISOString();
      await this.syncCodeAccess.save(syncCode);
    }

    await this.ses
      .sendEmail({
        Destination: {
          ToAddresses: [data.email],
        },
        Message: {
          Body: {
            Text: {
              Data: this.getEmailBody(data.language, code),
            },
          },
          Subject: {
            Data: this.getEmailSubject(data.language),
          },
        },
        Source: 'bunnybill-noreply@celestialstudio.net',
      })
      .promise();
  }

  public async bindDevice(
    data: PostDataSyncBindRequest,
    deviceId: string
  ): Promise<PostDataSyncBindResponse> {
    const syncCode = await this.syncCodeAccess.findOneOrFail({
      where: { email: data.email },
    });

    if (syncCode.code !== data.code)
      throw new BadRequestError(ErrorMessage.INVALID_CODE);

    const deviceBooks = await this.deviceBookAccess.findByDeviceId(deviceId);
    const targetDeviceBooks = await this.deviceBookAccess.findByDeviceId(
      syncCode.deviceId
    );
    for (const deviceBook of deviceBooks) {
      // check book exists in device or not
      if (targetDeviceBooks.map((v) => v.bookId).includes(deviceBook.bookId))
        continue;

      const newDeviceBook = new DeviceBookEntity();
      newDeviceBook.deviceId = syncCode.deviceId;
      newDeviceBook.bookId = deviceBook.bookId;
      newDeviceBook.showDelete = deviceBook.showDelete;
      await this.deviceBookAccess.save(newDeviceBook);
    }

    return { newDeviceId: syncCode.deviceId };
  }

  public async unbindDevice(
    deviceId: string
  ): Promise<PostDataSyncUnbindResponse> {
    const newDeviceId = uuidv4();
    const deviceBooks = await this.deviceBookAccess.findByDeviceId(deviceId);

    for (const deviceBook of deviceBooks) {
      const newDeviceBook = new DeviceBookEntity();
      newDeviceBook.deviceId = newDeviceId;
      newDeviceBook.bookId = deviceBook.bookId;
      newDeviceBook.showDelete = deviceBook.showDelete;
      await this.deviceBookAccess.save(newDeviceBook);
    }

    return { newDeviceId };
  }
}
