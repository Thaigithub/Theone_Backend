import { Member } from '@prisma/client';

export class ApplicationCompanyApplicantsLeaderDTO {
    contact: string;
    totalExperienceMonths: Member['totalExperienceMonths'];
    totalExperienceYears: Member['totalExperienceYears'];
    desiredSalary: Member['desiredSalary'];
}

export class ApplicationCompanyApplicantsTeamDTO {
    name: string;
    district: {
        englishName: string;
        koreanName: string;
        city: {
            englishName: string;
            koreanName: string;
        };
    };
    leader: ApplicationCompanyApplicantsLeaderDTO;
}
