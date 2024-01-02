import { ApiProperty } from '@nestjs/swagger';
import { SalaryType } from '@prisma/client';
import { ApplicationCompanyApplicantsPostCodeDTO } from './application-company-applicants-post-code.dto';

export class ApplicationCompanyApplicantsPostDTO {
    @ApiProperty({ example: 'abc' })
    public siteContact: string;

    @ApiProperty({ example: 1000000 })
    public salaryAmount: number;

    @ApiProperty({ type: 'enum', enum: SalaryType, example: SalaryType.DAILY })
    public salaryType: SalaryType;

    @ApiProperty({ example: 'abc' })
    public siteAddress: string;

    @ApiProperty({ type: ApplicationCompanyApplicantsPostCodeDTO })
    public occupation: ApplicationCompanyApplicantsPostCodeDTO;

    @ApiProperty({ type: ApplicationCompanyApplicantsPostCodeDTO })
    public specialNote: ApplicationCompanyApplicantsPostCodeDTO;
}
