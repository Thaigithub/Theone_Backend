import { ApiProperty } from '@nestjs/swagger';

export class ApplicationCompanyMemberDetailCodeDTO {
    @ApiProperty({ example: 'code' })
    public code: string;

    @ApiProperty({ example: 'codeName' })
    public codeName: string;
}
