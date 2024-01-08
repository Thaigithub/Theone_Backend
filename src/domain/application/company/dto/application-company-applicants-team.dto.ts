import { Member } from '@prisma/client';
import { ApplicationCompanyApplicantsSpecialDTO } from './application-company-applicants-member.dto';

export class ApplicationCompanyApplicantsLeaderDTO {
    contact: string;
    totalExperienceMonths: Member['totalExperienceMonths'];
    totalExperienceYears: Member['totalExperienceYears'];
    desiredSalary: Member['desiredSalary'];
    specialLicenses: ApplicationCompanyApplicantsSpecialDTO[];
}

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
    leader: ApplicationCompanyApplicantsLeaderDTO;
}
