import { ApiProperty } from '@nestjs/swagger';

export class AccountMemberCheckUsernameExistenceResponse {
    @ApiProperty({ type: Boolean })
    isExist: boolean;
}
