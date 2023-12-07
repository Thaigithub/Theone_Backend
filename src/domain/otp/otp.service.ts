import { Injectable } from '@nestjs/common';
import { OtpType } from '@prisma/client';
import { SMS_OTP_VALID_TIME } from 'app.config';
import { MailService } from 'services/mail/mail.service';
import { PrismaService } from 'services/prisma/prisma.service';
import { OTPGenerator } from 'utils/otp-generator';
import { getTimeDifferenceInMinutes } from 'utils/time-calculator';
import { OtpCheckValidRequest, OtpSendRequest } from './request/otp-send.request';
@Injectable()
export class OtpService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly mailService: MailService,
    ) {}
    async sendOtp(request: OtpSendRequest): Promise<void> {
        const newOtp = OTPGenerator.generateOTPString();
        const existedOtp = await this.prismaService.otpProvider.findFirst({
            where: {
                otpCode: newOtp,
            },
        });
        if (!existedOtp || getTimeDifferenceInMinutes(existedOtp.updatedAt) < parseInt(SMS_OTP_VALID_TIME, 10)) {
            await this.prismaService.otpProvider.create({
                data: {
                    otpType: request.type,
                    accountId: request.accountId,
                    otpCode: newOtp,
                },
            });
        } else {
            await this.prismaService.otpProvider.update({
                where: {
                    id: existedOtp.id,
                },
                data: {
                    accountId: request.accountId,
                    otpType: request.type,
                },
            });
        }
        if (request.type === OtpType.EMAIL) {
            const company = await this.prismaService.company.findUnique({
                where: {
                    accountId: request.accountId,
                },
                select: {
                    email: true,
                    name: true,
                },
            });
            await this.mailService.sendEmail(
                company.email,
                'OTP Verification Email',
                { name: company.name, code: newOtp },
                'otp-verify',
            );
        } else {
        }
    }
    async checkValidOtp(request: OtpCheckValidRequest): Promise<boolean> {
        const existedOtp = await this.prismaService.otpProvider.findFirst({
            where: {
                accountId: request.accountId,
                otpCode: request.code,
                otpType: request.type,
            },
        });
        if (!existedOtp || getTimeDifferenceInMinutes(existedOtp.updatedAt) > parseInt(SMS_OTP_VALID_TIME, 10)) {
            return false;
        }
        await this.prismaService.otpProvider.update({
            where: {
                id: existedOtp.id,
            },
            data: {
                checked: true,
            },
        });
        return true;
    }
    // async confirmValidOtp(request: OtpCheckValidRequest): Promise<boolean> {
    //     const existedOtp = await this.prismaService.otpProvider.findFirst({
    //         where: {
    //             otpCode: request.code,
    //             checked: true,
    //         },
    //     });
    //     if (!existedOtp) {
    //         throw new NotFoundException('Otp code is not valid');
    //     }
    //     await this.prismaService.otpProvider.delete({
    //         where: {
    //             id: existedOtp.id,
    //         },
    //     });
    //     return true;
    // }
}
