import { OtpStatus } from '../enum/auth-company-otp-status.enum';

export class AuthCompanyOtpVerifyResponse {
    otpId: number;
    isVerified: boolean;
    status: OtpStatus;
    data: string | null;
}
