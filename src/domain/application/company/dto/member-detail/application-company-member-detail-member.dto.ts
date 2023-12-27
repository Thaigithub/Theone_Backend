import { ApiProperty } from '@nestjs/swagger';
import { ApplicationCompanyMemberDetailAccountDTO } from './application-company-member-detail-account.dto';
import { ApplicationCompanyMemberDetailBHSCerDTO } from './application-company-member-detail-bhscer.dto';
import { ApplicationCompanyMemberDetailCareerDTO } from './application-company-member-detail-career.dto';
import { ApplicationCompanyMemberDetailSpecialDTO } from './application-company-member-detail-special.dto';
import { ApplicationCompanyMemberDetailCertificatesDTO } from './applicationo-company-member-detail-certificates.dto';

export class ApplicationCompantMemberDetailMemberDTO {
    @ApiProperty({ example: 'Dewon Kim' })
    public name: string;

    @ApiProperty({ example: '010-0000-0000' })
    public contact: string;

    @ApiProperty({ example: 'theone@gmail.com' })
    public email: string;

    @ApiProperty({
        type: 'object',
        example: {
            englishName: 'Seoul',
            koreanName: '근무지원내역',
        },
    })
    public city: {
        englishName: string;
        koreanName: string;
    };

    @ApiProperty({
        type: 'object',
        example: {
            englishName: 'Seoul',
            koreanName: '근무지원내역',
        },
    })
    public district: {
        englishName: string;
        koreanName: string;
    };

    @ApiProperty({ type: ApplicationCompanyMemberDetailAccountDTO })
    public account: ApplicationCompanyMemberDetailAccountDTO;

    @ApiProperty({ type: [ApplicationCompanyMemberDetailCareerDTO] })
    public career: ApplicationCompanyMemberDetailCareerDTO[];

    @ApiProperty({ type: [ApplicationCompanyMemberDetailCertificatesDTO] })
    public certificates: ApplicationCompanyMemberDetailCertificatesDTO[];

    @ApiProperty({ type: [ApplicationCompanyMemberDetailSpecialDTO] })
    public specialLicenses: ApplicationCompanyMemberDetailSpecialDTO[];

    @ApiProperty({ type: ApplicationCompanyMemberDetailBHSCerDTO })
    public basicHealthSafetyCertificate: ApplicationCompanyMemberDetailBHSCerDTO;
}
