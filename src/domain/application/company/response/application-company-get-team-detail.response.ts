import { Code, PostApplicationStatus } from '@prisma/client';
import { FileResponse } from 'utils/generics/file.response';

class ApplicationCompanyGetLeaderDetail {
    id: number;
    contact: string;
    name: string;
    totalExperienceYears: number;
    totalExperienceMonths: number;
    desiredSalary: number;
    occupations: Code['codeName'][];
}

class ApplicationCompanyGetMemberDetails extends ApplicationCompanyGetLeaderDetail {
    desiredOccupations: {
        codeName: string;
    }[];
}

export class ApplicationCompanyGetSpecialLicenses {
    id: number;
    codeName: string;
    licenseNumber: string;
}

export class ApplicationCompanyGetBasicHealthCertificate {
    registrationNumber: string;
    dateOfCompletion: Date;
    file: FileResponse;
}

export class ApplicationCompanyGetTeamDetail {
    name: string;
    totalMembers: number;
    contact: string;
    city: {
        englishName: string;
        koreanName: string;
    };
    district: {
        englishName: string;
        koreanName: string;
    };
    code: string;
    leader: ApplicationCompanyGetLeaderDetail;
    members: ApplicationCompanyGetMemberDetails[];

    specialLicenses: ApplicationCompanyGetSpecialLicenses[];
    status: PostApplicationStatus;
}
