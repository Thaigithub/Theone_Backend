import { OtpType } from '@prisma/client';

export class OtpSendRequest {
    email: string;
    phoneNumber: string;
    type: OtpType;
    ip: string;
}
