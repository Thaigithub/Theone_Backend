import { Code, SpecialLicense } from '@prisma/client';
import { ApplicationCompanyMemberDetailAccountDTO } from './application-company-member-detail-account.dto';
import { ApplicationCompanyMemberDetailBHSCerDTO } from './application-company-member-detail-bhscer.dto';
import { ApplicationCompanyMemberDetailCareerDTO } from './application-company-member-detail-career.dto';

export class ApplicationCompantMemberDetailMemberDTO {
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
    account: ApplicationCompanyMemberDetailAccountDTO;
    career: ApplicationCompanyMemberDetailCareerDTO[];
    specialLicenses: {
        name: Code['codeName'];
        licenseNumber: SpecialLicense['licenseNumber'];
    }[];
    basicHealthSafetyCertificate: ApplicationCompanyMemberDetailBHSCerDTO;
}
