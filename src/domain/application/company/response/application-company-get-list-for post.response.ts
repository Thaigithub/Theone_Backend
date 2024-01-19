import { Application, City, Code, District, Member, SpecialLicense } from '@prisma/client';
import { PaginationResponse } from 'utils/generics/pagination.response';

export class ApplicationCompanyGetListApplicantsItemResponse {
    id: Application['id'];
    assignedAt: Application['assignedAt'];
    member: {
        name: Member['name'];
        contact: Member['contact'];
        totalExperienceMonths: Member['totalExperienceMonths'];
        totalExperienceYears: Member['totalExperienceYears'];
        specialLicenses: {
            name: Code['codeName'];
            licenseNumber: SpecialLicense['licenseNumber'];
        }[];
        desiredSalary: Member['desiredSalary'];
        city: {
            englishName: City['englishName'];
            koreanName: City['koreanName'];
        };
        district: {
            englishName: District['englishName'];
            koreanName: District['koreanName'];
        };
    };
    team: {
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
    };
}

export class ApplicationCompanyGetListApplicantsResponse extends PaginationResponse<ApplicationCompanyGetListApplicantsItemResponse> {}
