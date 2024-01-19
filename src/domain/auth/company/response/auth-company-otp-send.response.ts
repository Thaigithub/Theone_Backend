import { OtpProvider } from '@prisma/client';

export class AuthCompanyOtpSendResponse {
    otpId: OtpProvider['id'];
}
