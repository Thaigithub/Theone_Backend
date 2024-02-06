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
    city: {
        englishName: Region['cityEnglishName'];
        koreanName: Region['cityKoreanName'];
    };
    district: {
        englishName: Region['districtEnglishName'];
        koreanName: Region['districtKoreanName'];
    };
    isActive: boolean;
}

export class GetListRecommendationLeaderResponse {
    contact: string;
    totalExperienceMonths: Member['totalExperienceMonths'];
    totalExperienceYears: Member['totalExperienceYears'];
    desiredSalary: Member['desiredSalary'];
    isActive: boolean;
}

class GetListRecommendationTeamResponse {
    name: string;
    city: {
        englishName: Region['cityEnglishName'];
        koreanName: Region['cityKoreanName'];
    };
    district: {
        englishName: Region['districtEnglishName'];
        koreanName: Region['districtKoreanName'];
    };
    leader: GetListRecommendationLeaderResponse;
    isActive: boolean;
}
class GetListRecommendationResponse {
    member: GetListRecommendationMemberResponse;
    team: GetListRecommendationTeamResponse;
}

export class HeadhuntingCompanyGetListRecommendationResponse extends PaginationResponse<GetListRecommendationResponse> {}
