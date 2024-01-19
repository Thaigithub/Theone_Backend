import { OtpProvider } from '@prisma/client';
import { OtpStatus } from '../enum/auth-company-otp-status.enum';

export class AuthCompanyOtpVerifyResponse {
    otpId: OtpProvider['id'];
    isVerified: boolean;
    status: OtpStatus;
    data: string | null;
}
