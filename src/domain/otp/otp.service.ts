import { BadRequestException, Injectable } from '@nestjs/common';
import { OtpType } from '@prisma/client';
import { SMS_OTP_VALID_TIME } from 'app.config';
import { MailService } from 'services/mail/mail.service';
import { PrismaService } from 'services/prisma/prisma.service';
import { OTPGenerator } from 'utils/otp-generator';
import { getTimeDifferenceInMinutes } from 'utils/time-calculator';
import { OtpSendRequest } from './request/otp-send.request';
import { OtpCheckValidRequest } from './request/otp-verify.request';
import { OtpSendResponse } from './response/otp-send.response';
import { OtpStatus, OtpVerifyResponse } from './response/otp-verify.response';
@Injectable()
export class OtpService {
    constructor(
        private prismaService: PrismaService,
        private mailService: MailService,
        // private smsService: SmsService,
    ) {}
    async sendOtp(request: OtpSendRequest): Promise<OtpSendResponse> {
        const existedOtp = await this.prismaService.otpProvider.findFirst({
            where: {
                ip: request.ip,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        if (getTimeDifferenceInMinutes(existedOtp.createdAt) < 1) {
            throw new BadRequestException('Wait for 1 minute till next request');
        }
        const otp = await this.prismaService.otpProvider.create({
            data: {
                otpCode: OTPGenerator.generateOTPString(),
                type: request.type,
                ip: request.ip,
            },
            select: {
                id: true,
                otpCode: true,
            },
        });
        if (request.type === OtpType.PHONE) {
            // await this.smsService.sendOTPSMS(request.phoneNumber, otp.otpCode);
        } else {
            await this.mailService.sendEmail(request.email, 'OTP Verification Email', { code: otp.otpCode }, 'otp-verify');
        }
        return { otpId: otp.id };
    }
    async checkValidOtp(request: OtpCheckValidRequest, ip: string): Promise<OtpVerifyResponse> {
        const existedOtp = await this.prismaService.otpProvider.findUnique({
            where: {
                id: request.otpId,
                ip,
            },
        });
        if (!existedOtp) {
            return {
                isVerified: false,
                status: OtpStatus.NOT_FOUND,
            };
        }
        if (getTimeDifferenceInMinutes(existedOtp.createdAt) > parseInt(SMS_OTP_VALID_TIME, 10)) {
            return {
                isVerified: false,
                status: OtpStatus.OUT_OF_TIME,
            };
        }
        if (existedOtp.otpCode !== request.code) {
            return {
                isVerified: false,
                status: OtpStatus.WRONG_CODE,
            };
        }
        await this.prismaService.otpProvider.update({
            where: {
                id: existedOtp.id,
            },
            data: {
                checked: true,
            },
        });
        return {
            isVerified: true,
            status: OtpStatus.VERIFIED,
        };
    }
}
