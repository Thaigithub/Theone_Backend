import { ApiProperty } from '@nestjs/swagger';
import { ApplicationCompanyMemberDetailAccountDTO } from './application-company-member-detail-account.dto';
import { ApplicationCompanyMemberDetailBHSCerDTO } from './application-company-member-detail-bhscer.dto';
import { ApplicationCompanyMemberDetailCareerDTO } from './application-company-member-detail-career.dto';
import { ApplicationCompanyMemberDetailCertificatesDTO } from './application-company-member-detail-certificates.dto';
import { ApplicationCompanyMemberDetailSpecialDTO } from './application-company-member-detail-special.dto';

export class ApplicationCompantMemberDetailMemberDTO {
    @ApiProperty({ example: 'Dewon Kim' })
    name: string;

    @ApiProperty({ example: '010-0000-0000' })
    contact: string;

    @ApiProperty({ example: 'theone@gmail.com' })
    email: string;

    @ApiProperty({
        type: 'object',
        example: {
            englishName: 'Seoul',
            koreanName: '근무지원내역',
        },
    })
    city: {
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
    district: {
        englishName: string;
        koreanName: string;
    };

    @ApiProperty({ type: ApplicationCompanyMemberDetailAccountDTO })
    account: ApplicationCompanyMemberDetailAccountDTO;

    @ApiProperty({ type: [ApplicationCompanyMemberDetailCareerDTO] })
    career: ApplicationCompanyMemberDetailCareerDTO[];

    @ApiProperty({ type: [ApplicationCompanyMemberDetailCertificatesDTO] })
    certificates: ApplicationCompanyMemberDetailCertificatesDTO[];

    @ApiProperty({ type: [ApplicationCompanyMemberDetailSpecialDTO] })
    specialLicenses: ApplicationCompanyMemberDetailSpecialDTO[];

    @ApiProperty({ type: ApplicationCompanyMemberDetailBHSCerDTO })
    basicHealthSafetyCertificate: ApplicationCompanyMemberDetailBHSCerDTO;
}
