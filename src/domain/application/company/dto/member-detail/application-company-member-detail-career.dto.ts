import { ApiProperty } from '@nestjs/swagger';
import { ApplicationCompanyMemberDetailCodeDTO } from './application-company-member-detail-code.dto';

export class ApplicationCompanyMemberDetailCareerDTO {
    @ApiProperty({ example: 'companyName' })
    public companyName: string;

    @ApiProperty({ example: 'siteName' })
    public siteName: string;

    @ApiProperty({ example: 'occupation' })
    public occupation: ApplicationCompanyMemberDetailCodeDTO;

    @ApiProperty({ example: '2023-12-12T09:32:38.008Z' })
    public startDate: Date;

    @ApiProperty({ example: '2023-12-12T09:32:38.008Z' })
    public endDate: Date;

    @ApiProperty({ example: 1 })
    public experiencedYears: number;

    @ApiProperty({ example: 1 })
    public experiencedMonths: number;
}
