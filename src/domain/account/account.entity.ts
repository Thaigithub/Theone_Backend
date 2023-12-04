import { $Enums, Prisma } from '@prisma/client';
import { BaseEntity } from '../../helpers/entity/base.entity';

export class Account extends BaseEntity implements Prisma.AccountUncheckedCreateInput {
    constructor(username: string, password: string, type: $Enums.AccountType, status: $Enums.AccountStatus) {
        super();
        this.username = username;
        this.password = password;
        this.type = type;
        this.status = status;
    }

    id?: number;
    username: string;
    password: string;
    type: $Enums.AccountType;
    status: $Enums.AccountStatus;
    isActive?: boolean;
    createdAt?: string | Date;
    updatedAt?: string | Date;
}
