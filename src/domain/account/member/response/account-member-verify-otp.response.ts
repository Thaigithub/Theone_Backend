import { OtpProvider } from '@prisma/client';

export class AccountMemberVerifyOtpVerifyPhoneResponse {
    isVerified: boolean;
    status: OtpStatus;
    otpId: OtpProvider['id'];
    data: string | null;
}

enum OtpStatus {
    OUT_OF_TIME = 'OUT_OF_TIME',
    WRONG_CODE = 'WRONG_CODE',
    NOT_FOUND = 'NOT_FOUND',
    VERIFIED = 'VERIFIED',
}
