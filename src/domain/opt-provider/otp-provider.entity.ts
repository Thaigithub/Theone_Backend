import { Prisma } from '@prisma/client';
import { BaseEntity } from '../../helpers/entity/base.entity';

export class OtpProvider extends BaseEntity implements Prisma.OtpProviderUncheckedCreateInput {
    constructor(accountId: number, phoneNumber: string) {
        super();
        this.accountId = accountId;
        this.phoneNumber = phoneNumber;
    }
    id?: number;
    accountId: number;
    updatedAt?: string | Date;
    phoneNumber?: string;
    otpCode?: string;
}
