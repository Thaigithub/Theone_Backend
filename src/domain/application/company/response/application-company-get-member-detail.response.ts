import { Code } from '@prisma/client';
import { ApplicationCompanyMemberDetailAccountDTO } from '../dto/application-company-member-detail-account.dto';
import { ApplicationCompanyMemberDetailBHSCerDTO } from '../dto/application-company-member-detail-bhscer.dto';
import { ApplicationCompanyMemberDetailCareerDTO } from '../dto/application-company-member-detail-career.dto';
import { ApplicationCompanyMemberDetailCertificatesDTO } from '../dto/application-company-member-detail-certificates.dto';
import { ApplicationCompanyMemberDetailSpecialDTO } from '../dto/application-company-member-detail-special.dto';

export class ApplicationCompanyGetMemberDetail {
    name: string;
    contact: string;
    email: string;
    city: {
        englishName: string;
        koreanName: string;
    };
    district: {
        englishName: string;
        koreanName: string;
    };
    occupation: Code['codeName'];
    account: ApplicationCompanyMemberDetailAccountDTO;
    career: ApplicationCompanyMemberDetailCareerDTO[];
    certificates: ApplicationCompanyMemberDetailCertificatesDTO[];
    specialLicenses: ApplicationCompanyMemberDetailSpecialDTO[];
    basicHealthSafetyCertificate: ApplicationCompanyMemberDetailBHSCerDTO;
}
