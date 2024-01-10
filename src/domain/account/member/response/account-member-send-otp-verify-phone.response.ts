import { OtpProvider } from '@prisma/client';

export class AccountMemberSendOtpVerifyPhoneResponse {
    otpId: OtpProvider['id'];
}
