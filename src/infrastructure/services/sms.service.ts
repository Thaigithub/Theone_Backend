import { Injectable } from '@nestjs/common';
import CoolsmsMessageService from 'coolsms-node-sdk';
import { COOLSMS_KEY, COOLSMS_SECRET, SENDER_PHONE_NUMBER } from 'app.config';
import { OTPGenerator } from 'common/utils/otp-generator';

@Injectable()
export class OTPService {
  private messageService: CoolsmsMessageService;
  constructor() {
    this.messageService = new CoolsmsMessageService(COOLSMS_KEY, COOLSMS_SECRET);
  }
  async sendOTPSMS(phoneNumber: string): Promise<any> {
    const OTP = OTPGenerator.generateOTPString();
    try {
      const response = await this.messageService.sendOne({
        to: '수신번호',
        from: SENDER_PHONE_NUMBER,
        text: OTP,
        autoTypeDetect: true,
      });
      if (response.statusCode) {
        console.log(response);
        return true;
      } else {
      }
      const key = `otp:${phoneNumber}`;
      
    } catch (error) {
      throw new Error(`SMS sending failed: ${error.message}`);
    }
  }

  async verifyOTP(request: OTPVerificationRequest): Promise<boolean> {
    const key = `otp:${request.phoneNumber}`;
    const storedOTP = await this.redisClient.get(key);
    return storedOTP === request.code;
  }
}

