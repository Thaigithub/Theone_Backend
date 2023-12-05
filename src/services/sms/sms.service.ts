import { Injectable } from '@nestjs/common';
import { COOLSMS_KEY, COOLSMS_SECRET } from 'app.config';
import CoolsmsMessageService from 'coolsms-node-sdk';

@Injectable()
export class SmsService {
    private coolsmsMessageService: CoolsmsMessageService;
    constructor() {
        this.coolsmsMessageService = new CoolsmsMessageService(COOLSMS_KEY, COOLSMS_SECRET);
    }
    async sendOTPSMS(): Promise<boolean> {
        try {
            return true;
        } catch (error) {
            throw new Error(`SMS sending failed: ${error.message}`);
        }
    }
}
