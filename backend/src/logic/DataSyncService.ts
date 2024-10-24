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
import { bn } from 'src/util/bignumber';
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

  private getEmailBody(code: string, language: string) {
    let title = '';
    let dearUser = '';
    let hello = '';
    let contactUs = '';
    let url = '';
    switch (language) {
      case 'zh-TW':
        title = '綁定裝置';
        dearUser = '親愛的使用者';
        hello = '您好！綁定裝置的驗證碼為';
        contactUs = '聯絡我們';
        url =
          'https://docs.google.com/forms/d/e/1FAIpQLSdaWAnpxINF4m1msJQT-Qr9yAyukZHlUQSoEpZktv0ZId0n0Q/viewform?usp=sf_link';
        break;
      case 'zh-CN':
        title = '绑定装置';
        dearUser = '亲爱的使用者';
        hello = '您好！绑定装置的验证码为';
        contactUs = '联络我们';
        url =
          'https://docs.google.com/forms/d/e/1FAIpQLSeUk9z9zevegaKzu1zuUlElWyZnRRPo798Z16QCBRJ17x8wxg/viewform?usp=sf_link';
        break;
      default:
        title = 'Bind Your Device';
        dearUser = 'Dear user,';
        hello = 'Hello! Your verification code is,';
        contactUs = 'Contact Us';
        url =
          'https://docs.google.com/forms/d/e/1FAIpQLSe1KgW43gWaH1FDuu3DeD67t5UJExvAr7DmLnGO54mRaMMMLg/viewform?usp=sf_link';
        break;
    }

    return {
      text: `${dearUser}\n${hello} ${code}`,
      html: `<html>
        <head>
            <style type="text/css">
                body {
                    max-width: 600px;
                    padding: 16px 10px;
                }
                p {
                    margin: 0 0 5px 0;
                }
                .card {
                    background-color: #f7f9f9;
                    color: #13284b;
                    padding: 24px 16px 40px 16px;
                    margin: 16px 0;
                    border-radius: 10px;
                }
                .title {
                    font-size: 24px;
                    font-weight: bold;
                    text-align: center;
                }
                .horizon {
                    margin: 24px 0;
                    background-color: #e3e5e5;
                    height: 1px;
                }
                .code {
                    font-weight: bold;
                    color: black;
                    margin: 24px 0;
                }
                .contact {
                    font-size: 14px;
                    text-decoration: underline;
                }
                .org {
                    color: #567196;
                    font-size: 14px;
                    text-align: center;
                }
            </style>
        </head>
        <body>
            <img src="https://yue-public-bucket.s3.ap-southeast-1.amazonaws.com/spica-email-logo.png"></img>
            <div class="card">
                <div class="title">${title}</div>
                <div class="horizon"></div>
                <div class="content">
                    <p>${dearUser}</p>
                    <p>${hello}</p>
                    <div class="code">${code}</div>
                    <p>Bunny Bill</p>
                    <p class="contact"></p><a
                        href="${url}"
                        target="_blank">${contactUs}</a></p>
                </div>
            </div>
            <div class="org">© Celetial Studio 2022 - ${new Date().getFullYear()}</div>
        </body>
        </html>`,
    };
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
    const email = data.email.toLowerCase();
    const emailBind = await this.emailBindAccess.findOne({
      where: { email },
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
      newEmailBind.email = email;
      newEmailBind.deviceId = deviceId;
      newEmailBind.code = code;
      newEmailBind.codeGenerated = new Date().toISOString();
      newEmailBind.count = '0';
      await this.emailBindAccess.save(newEmailBind);
    } else {
      emailBind.code = code;
      emailBind.codeGenerated = new Date().toISOString();
      await this.emailBindAccess.save(emailBind);
    }

    await this.ses
      .sendEmail({
        Destination: {
          ToAddresses: [email],
        },
        Message: {
          Body: {
            Text: {
              Charset: 'UTF-8',
              Data: this.getEmailBody(code, data.language).text,
            },
            Html: {
              Charset: 'UTF-8',
              Data: this.getEmailBody(code, data.language).html,
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
    const email = data.email.toLowerCase();
    const emailBind = await this.emailBindAccess.findOneOrFail({
      where: { email },
    });
    emailBind.count = bn(emailBind.count).plus(1).toString();
    await this.emailBindAccess.save(emailBind);

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
    const emailBind = await this.emailBindAccess.findOneOrFail({
      where: { deviceId },
    });
    const count = bn(emailBind.count).minus(1);
    emailBind.count = count.lt(0) ? '0' : count.toString();
    await this.emailBindAccess.save(emailBind);

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
