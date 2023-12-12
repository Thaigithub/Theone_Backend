import { ApiProperty } from '@nestjs/swagger';
import { ApplicationCompanyMemberDetailFileDTO } from './application-company-member-detail-file.dto';

export class ApplicationCompanyMemberDetailBHSCerDTO {
    @ApiProperty({ example: 'registrationNumber' })
    public registrationNumber: string;

    @ApiProperty({ example: 'dateOfCompletion' })
    public dateOfCompletion: Date;

    @ApiProperty({ type: ApplicationCompanyMemberDetailFileDTO })
    public file: ApplicationCompanyMemberDetailFileDTO;
}
