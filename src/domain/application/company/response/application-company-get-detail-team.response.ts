import { Code, PostApplicationStatus, Region } from '@prisma/client';

export class ApplicationCompanyGetDetailTeamResponse {
    name: string;
    totalMembers: number;
    contact: string;
    city: {
        englishName: Region['cityEnglishName'];
        koreanName: Region['cityKoreanName'];
    };
    district: {
        englishName: Region['districtEnglishName'];
        koreanName: Region['districtKoreanName'];
    };
    code: string;
    leader: {
        id: number;
        contact: string;
        name: string;
        totalExperienceYears: number;
        totalExperienceMonths: number;
        desiredSalary: number;
        occupations: Code['name'][];
    };
    members: {
        id: number;
        contact: string;
        name: string;
        totalExperienceYears: number;
        totalExperienceMonths: number;
        desiredSalary: number;
        occupations: Code['name'][];
    }[];
    licenses: {
        id: number;
        codeName: string;
        licenseNumber: string;
    }[];
    status: PostApplicationStatus;
}
