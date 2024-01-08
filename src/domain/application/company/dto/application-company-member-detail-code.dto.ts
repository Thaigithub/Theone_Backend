import { ApiProperty } from '@nestjs/swagger';

export class ApplicationCompanyMemberDetailCodeDTO {
    @ApiProperty({ example: 'code' })
    code: string;

    @ApiProperty({ example: 'codeName' })
    codeName: string;
}
