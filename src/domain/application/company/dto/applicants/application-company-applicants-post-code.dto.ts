import { ApiProperty } from '@nestjs/swagger';

export class ApplicationCompanyApplicantsPostCodeDTO {
    @ApiProperty({ example: 'abc' })
    public code?: string;

    @ApiProperty({ example: 'abc' })
    public codeName: string;
}
