import { OtpStatus } from '../enum/auth-company-otp-status.enum';

export class AuthCompanyOtpVerifyResponse {
    isVerified: boolean;
    status: OtpStatus;
}
