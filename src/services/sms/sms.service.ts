import { Injectable } from '@nestjs/common';
import { COOLSMS_KEY, COOLSMS_SECRET } from 'app.config';
import CoolsmsMessageService from 'coolsms-node-sdk';

@Injectable()
export class SmsService {
    constructor(private coolsmsMessageService: CoolsmsMessageService) {
        this.coolsmsMessageService = new CoolsmsMessageService(COOLSMS_KEY, COOLSMS_SECRET);
    }
    async sendOTPSMS(phoneNumber: string, otpCode: string): Promise<void> {
        // this.coolsmsMessageService.sendOne();
    }
}
