import { Code, Member, SpecialLicense } from '@prisma/client';

export class ApplicationCompanyApplicantsTeamDTO {
    name: string;
    district: {
        englishName: string;
        koreanName: string;
    };
    city: {
        englishName: string;
        koreanName: string;
    };
    leader: {
        contact: string;
        totalExperienceMonths: Member['totalExperienceMonths'];
        totalExperienceYears: Member['totalExperienceYears'];
        desiredSalary: Member['desiredSalary'];
        specialLicenses: {
            name: Code['codeName'];
            licenseNumber: SpecialLicense['licenseNumber'];
        }[];
    };
}
