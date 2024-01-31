import { OtpProvider } from '@prisma/client';
import { OtpStatus } from '../enum/account-member-verify-otp-status.enum';

export class AccountMemberVerifyOtpVerifyPhoneResponse {
    isVerified: boolean;
    status: OtpStatus;
    otpId: OtpProvider['id'];
    data: string | null;
}
