import { Injectable, NotFoundException } from '@nestjs/common';
import { COOLSMS_KEY, COOLSMS_SECRET } from 'app.config';
import CoolsmsMessageService from 'coolsms-node-sdk';

@Injectable()
export class SmsService {
    constructor(private coolsmsMessageService: CoolsmsMessageService) {
        this.coolsmsMessageService = new CoolsmsMessageService(COOLSMS_KEY, COOLSMS_SECRET);
    }
    async sendOTPSMS(phoneNumber: string, otpCode: string): Promise<void> {
        try {
            if ((await this.coolsmsMessageService.getBalance()).balance > 0)
                await this.coolsmsMessageService.sendOne({
                    to: phoneNumber,
                    text: `Your OTP Code for TheOne is ${otpCode}. If you didn't request for OTP verification, please ignore the message. Please do not share this code to anyone.`,
                    from: '821063936650',
                    autoTypeDetect: true,
                });
        } catch (error) {
            throw new NotFoundException('Phone number not found');
        }
    }
}
