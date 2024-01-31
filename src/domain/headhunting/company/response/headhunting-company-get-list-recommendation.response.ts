import { Member, Region } from '@prisma/client';
import { PaginationResponse } from 'utils/generics/pagination.response';

class GetListRecommendationMemberResponse {
    name: Member['name'];
    contact: Member['contact'];
    totalExperienceMonths: Member['totalExperienceMonths'];
    totalExperienceYears: Member['totalExperienceYears'];
    licenses: {
        name: string;
        licenseNumber: string;
    }[];
    desiredSalary: Member['desiredSalary'];
    region: {
        cityEnglishName: Region['cityEnglishName'];
        cityKoreanName: Region['cityKoreanName'];
        districtEnglishName: Region['districtEnglishName'];
        districtKoreanName: Region['districtKoreanName'];
    };
}

export class GetListRecommendationLeaderResponse {
    contact: string;
    totalExperienceMonths: Member['totalExperienceMonths'];
    totalExperienceYears: Member['totalExperienceYears'];
    desiredSalary: Member['desiredSalary'];
}

class GetListRecommendationTeamResponse {
    name: string;
    region: {
        cityEnglishName: Region['cityEnglishName'];
        cityKoreanName: Region['cityKoreanName'];
        districtEnglishName: Region['districtEnglishName'];
        districtKoreanName: Region['districtKoreanName'];
    };
    leader: GetListRecommendationLeaderResponse;
}
class GetListRecommendationResponse {
    member: GetListRecommendationMemberResponse;
    team: GetListRecommendationTeamResponse;
}

export class HeadhuntingCompanyGetListRecommendationResponse extends PaginationResponse<GetListRecommendationResponse> {}
