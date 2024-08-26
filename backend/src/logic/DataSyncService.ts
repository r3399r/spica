import { SES } from 'aws-sdk';
import { inject, injectable } from 'inversify';
import { v4 as uuidv4 } from 'uuid';
import { DeviceBookAccess } from 'src/access/DeviceBookAccess';
import { EmailBindAccess } from 'src/access/EmailBindAccess';
import { ErrorMessage } from 'src/constant/ErrorMessage';
import {
  PostDataSyncBindRequest,
  PostDataSyncBindResponse,
  PostDataSyncRequest,
  PostDataSyncUnbindResponse,
} from 'src/model/api/DataSync';
import { DeviceBookEntity } from 'src/model/entity/DeviceBookEntity';
import { EmailBindEntity } from 'src/model/entity/EmailBindEntity';
import { BadRequestError } from 'src/model/error';
import { randomBase10 } from 'src/util/random';

/**
 * Service class for DataSync
 */
@injectable()
export class DataSyncService {
  @inject(SES)
  private readonly ses!: SES;

  @inject(EmailBindAccess)
  private readonly emailBindAccess!: EmailBindAccess;

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
    const emailBind = await this.emailBindAccess.findOne({
      where: { email: data.email },
    });
    if (
      emailBind &&
      new Date().getTime() - new Date(emailBind.codeGenerated).getTime() <
        10 * 60 * 1000
    )
      throw new BadRequestError(ErrorMessage.TOO_FREQUENT);

    const code = randomBase10(6);
    if (emailBind === null) {
      const newEmailBind = new EmailBindEntity();
      newEmailBind.email = data.email;
      newEmailBind.deviceId = deviceId;
      newEmailBind.code = code;
      newEmailBind.codeGenerated = new Date().toISOString();
      await this.emailBindAccess.save(newEmailBind);
    } else {
      emailBind.code = code;
      emailBind.codeGenerated = new Date().toISOString();
      await this.emailBindAccess.save(emailBind);
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
    const emailBind = await this.emailBindAccess.findOneOrFail({
      where: { email: data.email },
    });

    if (emailBind.code !== data.code)
      throw new BadRequestError(ErrorMessage.INVALID_CODE);

    const deviceBooks = await this.deviceBookAccess.findByDeviceId(deviceId);
    const targetDeviceBooks = await this.deviceBookAccess.findByDeviceId(
      emailBind.deviceId
    );
    for (const deviceBook of deviceBooks) {
      // check book exists in device or not
      if (targetDeviceBooks.map((v) => v.bookId).includes(deviceBook.bookId))
        continue;

      const newDeviceBook = new DeviceBookEntity();
      newDeviceBook.deviceId = emailBind.deviceId;
      newDeviceBook.bookId = deviceBook.bookId;
      newDeviceBook.showDelete = deviceBook.showDelete;
      await this.deviceBookAccess.save(newDeviceBook);
    }

    return { newDeviceId: emailBind.deviceId };
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
