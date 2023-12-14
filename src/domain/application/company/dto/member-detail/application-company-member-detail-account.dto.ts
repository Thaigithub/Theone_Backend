import { ApiProperty } from '@nestjs/swagger';

export class ApplicationCompanyMemberDetailAccountDTO {
    @ApiProperty({ example: 'member' })
    public username: string;
}
