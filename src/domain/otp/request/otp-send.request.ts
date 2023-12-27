import { OtpType } from '@prisma/client';

export class OtpSendRequest {
    public email: string;
    public phoneNumber: string;
    public type: OtpType;
    public ip: string;
}
