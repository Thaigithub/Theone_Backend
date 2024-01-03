import { ApiProperty } from '@nestjs/swagger';
import { ApplicationCompanyMemberDetailAccountDTO } from '../dto/member-detail/application-company-member-detail-account.dto';
import { ApplicationCompanyMemberDetailBHSCerDTO } from '../dto/member-detail/application-company-member-detail-bhscer.dto';
import { ApplicationCompanyMemberDetailCareerDTO } from '../dto/member-detail/application-company-member-detail-career.dto';
import { ApplicationCompanyMemberDetailCertificatesDTO } from '../dto/member-detail/application-company-member-detail-certificates.dto';
import { ApplicationCompanyMemberDetailSpecialDTO } from '../dto/member-detail/application-company-member-detail-special.dto';

export class ApplicationCompanyGetMemberDetail {
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
