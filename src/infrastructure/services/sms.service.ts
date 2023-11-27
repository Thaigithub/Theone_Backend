import { Injectable } from '@nestjs/common';
import CoolsmsMessageService from 'coolsms-node-sdk';
import { COOLSMS_KEY, COOLSMS_SECRET, SENDER_PHONE_NUMBER } from 'app.config';

@Injectable()
export class OtpService {
  private coolsmsMessageService: CoolsmsMessageService;
  constructor() {
    this.coolsmsMessageService = new CoolsmsMessageService(COOLSMS_KEY, COOLSMS_SECRET);
  }
  async sendOTPSMS(phoneNumber: string, otp: string): Promise<boolean> {
    try {
      // const response = await this.coolsmsMessageService.sendOne({
      //   to: phoneNumber,
      //   from: SENDER_PHONE_NUMBER,
      //   text: otp,
      //   autoTypeDetect: true,
      // });
      // if (response.statusCode) {
      //   return true;
      // } else {
      // }
      return true;
    } catch (error) {
      throw new Error(`SMS sending failed: ${error.message}`);
    }
  }
}
