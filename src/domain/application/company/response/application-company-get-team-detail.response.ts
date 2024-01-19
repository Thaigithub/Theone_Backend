import { Code, PostApplicationStatus } from '@prisma/client';

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
    leader: {
        id: number;
        contact: string;
        name: string;
        totalExperienceYears: number;
        totalExperienceMonths: number;
        desiredSalary: number;
        occupations: Code['codeName'][];
    };
    members: {
        id: number;
        contact: string;
        name: string;
        totalExperienceYears: number;
        totalExperienceMonths: number;
        desiredSalary: number;
        occupations: Code['codeName'][];
        desiredOccupations: {
            codeName: string;
        }[];
    }[];

    specialLicenses: {
        id: number;
        codeName: string;
        licenseNumber: string;
    }[];
    status: PostApplicationStatus;
}
