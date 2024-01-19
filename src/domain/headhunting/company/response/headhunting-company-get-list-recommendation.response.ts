import { Member } from '@prisma/client';
import { PaginationResponse } from 'utils/generics/pagination.response';

export class RecommendationCompanyGetItemHeadhuntingApprovedMemberDTO {
    name: Member['name'];
    contact: Member['contact'];
    totalExperienceMonths: Member['totalExperienceMonths'];
    totalExperienceYears: Member['totalExperienceYears'];
    specialLicenses: {
        name: string;
        licenseNumber: string;
    }[];
    desiredSalary: Member['desiredSalary'];
    city: {
        englishName: string;
        koreanName: string;
    };
    district: {
        englishName: string;
        koreanName: string;
    };
}

export class RecommendationCompanyGetItemHeadhuntingApprovedLeaderDTO {
    contact: string;
    totalExperienceMonths: Member['totalExperienceMonths'];
    totalExperienceYears: Member['totalExperienceYears'];
    desiredSalary: Member['desiredSalary'];
}

export class RecommendationCompanyGetItemHeadhuntingApprovedTeamDTO {
    name: string;
    district: {
        englishName: string;
        koreanName: string;
    };
    city: {
        englishName: string;
        koreanName: string;
    };
    leader: RecommendationCompanyGetItemHeadhuntingApprovedLeaderDTO;
}
export class RecommendationCompanyGetItemHeadhuntingApprovedResponse {
    member: RecommendationCompanyGetItemHeadhuntingApprovedMemberDTO;
    team: RecommendationCompanyGetItemHeadhuntingApprovedTeamDTO;
}

export class RecommendationCompanyGetListHeadhuntingApprovedResponse extends PaginationResponse<RecommendationCompanyGetItemHeadhuntingApprovedResponse> {}
