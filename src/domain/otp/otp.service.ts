import { BadRequestException, Injectable } from '@nestjs/common';
import { OtpProvider, OtpType } from '@prisma/client';
import { SMS_OTP_VALID_TIME } from 'app.config';
import { MailService } from 'services/mail/mail.service';
import { PrismaService } from 'services/prisma/prisma.service';
import { OTPGenerator } from 'utils/otp-generator';
import { getTimeDifferenceInMinutes } from 'utils/time-calculator';
import { OtpSendRequest } from './request/otp-send.request';
import { OtpCheckValidRequest } from './request/otp-verify.request';
import { OtpSendResponse } from './response/otp-send.response';
import { OtpStatus, OtpVerifyResponse } from './response/otp-verify.response';
import { Error } from 'utils/error.enum';
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
        if (existedOtp) {
            if (getTimeDifferenceInMinutes(existedOtp.createdAt) < 1) {
                throw new BadRequestException(Error.A_MINUTE_MINIMUM_TILL_NEXT_REQUEST);
            }
        }
        const otp = await this.prismaService.otpProvider.create({
            data: {
                otpCode: OTPGenerator.generateOTPString(),
                type: request.type,
                ip: request.ip,
                data: request.data,
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
                otpId: null,
                isVerified: false,
                status: OtpStatus.NOT_FOUND,
                data: null,
            };
        }
        if (getTimeDifferenceInMinutes(existedOtp.createdAt) > parseInt(SMS_OTP_VALID_TIME, 10)) {
            return {
                otpId: null,
                isVerified: false,
                status: OtpStatus.OUT_OF_TIME,
                data: null,
            };
        }
        if (existedOtp.otpCode !== request.code) {
            return {
                otpId: null,
                isVerified: false,
                status: OtpStatus.WRONG_CODE,
                data: null,
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
            otpId: request.otpId,
            isVerified: true,
            status: OtpStatus.VERIFIED,
            data: existedOtp.data,
        };
    }
    async getOtp(id: number, ip: string): Promise<OtpProvider> {
        return await this.prismaService.otpProvider.findUnique({
            where: {
                id,
                ip,
                isUsed: false,
            },
        });
    }
    async usedOtp(id: number): Promise<void> {
        await this.prismaService.otpProvider.update({
            where: {
                id,
            },
            data: {
                isUsed: true,
            },
        });
    }
}
