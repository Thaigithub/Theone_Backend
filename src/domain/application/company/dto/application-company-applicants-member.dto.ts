import { City, Code, District, Member, SpecialLicense } from '@prisma/client';

export class ApplicationCompanyApplicantsSpecialDTO {
    name: Code['codeName'];
    licenseNumber: SpecialLicense['licenseNumber'];
}

export class ApplicationCompanyApplicantsMemberDTO {
    name: Member['name'];
    contact: Member['contact'];
    totalExperienceMonths: Member['totalExperienceMonths'];
    totalExperienceYears: Member['totalExperienceYears'];
    specialLicenses: ApplicationCompanyApplicantsSpecialDTO[];
    desiredSalary: Member['desiredSalary'];
    city: {
        englishName: City['englishName'];
        koreanName: City['koreanName'];
    };
    district: {
        englishName: District['englishName'];
        koreanName: District['koreanName'];
    };
}
