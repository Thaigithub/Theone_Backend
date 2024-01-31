import { Application, Code, License, Member, Region, Team } from '@prisma/client';
import { PaginationResponse } from 'utils/generics/pagination.response';

export class GetListPostResponse {
    id: Application['id'];
    assignedAt: Application['assignedAt'];
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
        region: {
            cityEnglishName: Region['cityEnglishName'];
            cityKoreanName: Region['cityKoreanName'];
            districtEnglishName: Region['districtEnglishName'];
            districtKoreanName: Region['districtKoreanName'];
        };
    };
    team: {
        name: Team['name'];
        region: {
            cityEnglishName: Region['cityEnglishName'];
            cityKoreanName: Region['cityKoreanName'];
            districtEnglishName: Region['districtEnglishName'];
            districtKoreanName: Region['districtKoreanName'];
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
    };
}

export class ApplicationCompanyGetListPostResponse extends PaginationResponse<GetListPostResponse> {}
