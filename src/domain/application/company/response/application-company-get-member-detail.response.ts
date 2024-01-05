import { ApplicationCompanyMemberDetailAccountDTO } from '../dto/member-detail/application-company-member-detail-account.dto';
import { ApplicationCompanyMemberDetailBHSCerDTO } from '../dto/member-detail/application-company-member-detail-bhscer.dto';
import { ApplicationCompanyMemberDetailCareerDTO } from '../dto/member-detail/application-company-member-detail-career.dto';
import { ApplicationCompanyMemberDetailCertificatesDTO } from '../dto/member-detail/application-company-member-detail-certificates.dto';
import { ApplicationCompanyMemberDetailSpecialDTO } from '../dto/member-detail/application-company-member-detail-special.dto';
import { Code } from '@prisma/client';

export class ApplicationCompanyGetMemberDetail {
    public name: string;
    public contact: string;
    public email: string;
    public city: {
        englishName: string;
        koreanName: string;
    };
    public district: {
        englishName: string;
        koreanName: string;
    };
    public occupation: Code['codeName'];
    public account: ApplicationCompanyMemberDetailAccountDTO;
    public career: ApplicationCompanyMemberDetailCareerDTO[];
    public certificates: ApplicationCompanyMemberDetailCertificatesDTO[];
    public specialLicenses: ApplicationCompanyMemberDetailSpecialDTO[];
    public basicHealthSafetyCertificate: ApplicationCompanyMemberDetailBHSCerDTO;
}
