import { ApiProperty } from '@nestjs/swagger';
import { AccountType } from '@prisma/client';

export class AuthAdminLoginResponse {
    @ApiProperty({ type: String })
    token: string;
    @ApiProperty({ type: String })
    uid: string;
    @ApiProperty({ type: 'enum', enum: AccountType })
    type: AccountType;
}
