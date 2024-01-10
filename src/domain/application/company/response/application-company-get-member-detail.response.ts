import { PostApplicationStatus } from '@prisma/client';
import {
    ApplicationCompanyGetBasicHealthCertificate,
    ApplicationCompanyGetSpecialLicenses,
} from './application-company-get-team-detail.response';

class ApplicationCompanyGetCareerDetail {
    startDate: Date;
    endDate: Date;
    companyName: string;
    siteName: string;
    occupation: string;
}

export class ApplicationCompanyGetMemberDetail {
    id: number;
    name: string;
    username: string;
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
    desiredSalary: number;
    totalExperienceMonths: number;
    totalExperienceYears: number;
    desiredOccupations: {
        codeName: string;
    }[];
    careers: ApplicationCompanyGetCareerDetail[];
    specialLicenses: ApplicationCompanyGetSpecialLicenses[];
    basicHealthSafetyCertificate: ApplicationCompanyGetBasicHealthCertificate;
    status: PostApplicationStatus;
}
