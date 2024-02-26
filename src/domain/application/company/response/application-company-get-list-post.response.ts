import { Application, Code, License, Member, Region, Team } from '@prisma/client';
import { PaginationResponse } from 'utils/generics/pagination.response';

export class GetListPostResponse {
    id: Application['id'];
    assignedAt: Application['assignedAt'];
    status: Application['status'];
    member: {
        name: Member['name'];
        contact: Member['contact'];
        totalExperienceMonths: Member['totalExperienceMonths'];
        totalExperienceYears: Member['totalExperienceYears'];
        licenses: {
            name: Code['name'];
            licenseNumber: License['licenseNumber'];
        }[];
        desiredSalary: Member['desiredSalary'];
        city: {
            englishName: Region['cityEnglishName'];
            koreanName: Region['cityKoreanName'];
        };
        district: {
            englishName: Region['districtEnglishName'];
            koreanName: Region['districtKoreanName'];
        };
        isActive: boolean;
    };
    team: {
        name: Team['name'];
        city: {
            englishName: Region['cityEnglishName'];
            koreanName: Region['cityKoreanName'];
        };
        district: {
            englishName: Region['districtEnglishName'];
            koreanName: Region['districtKoreanName'];
        };
        leader: {
            contact: Member['contact'];
            totalExperienceMonths: Member['totalExperienceMonths'];
            totalExperienceYears: Member['totalExperienceYears'];
            desiredSalary: Member['desiredSalary'];
            licenses: {
                name: Code['name'];
                licenseNumber: License['licenseNumber'];
            }[];
        };
        isActive: boolean;
    };
}

export class ApplicationCompanyGetListPostResponse extends PaginationResponse<GetListPostResponse> {}
