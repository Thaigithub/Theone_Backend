import { ApiProperty } from '@nestjs/swagger';
import { Member } from '@prisma/client';
import { ApplicationCompanyApplicantsSpecialDTO } from 'domain/application/company/dto/application-company-applicants-member.dto';
import { PaginationResponse } from 'utils/generics/pagination.response';

export class RecommendationCompanyGetItemHeadhuntingApprovedMemberDTO {
    @ApiProperty({ example: 'abc' })
    name: Member['name'];

    @ApiProperty({ example: 'abc' })
    contact: Member['contact'];

    @ApiProperty({ example: 'abc' })
    totalExperienceMonths: Member['totalExperienceMonths'];

    @ApiProperty({ example: 'abc' })
    totalExperienceYears: Member['totalExperienceYears'];

    @ApiProperty({ type: [ApplicationCompanyApplicantsSpecialDTO] })
    specialLicenses: ApplicationCompanyApplicantsSpecialDTO[];

    @ApiProperty({ example: 'abc' })
    desiredSalary: Member['desiredSalary'];

    @ApiProperty()
    city: {
        englishName: string;
        koreanName: string;
    };

    @ApiProperty()
    district: {
        englishName: string;
        koreanName: string;
    };
}

export class RecommendationCompanyGetItemHeadhuntingApprovedLeaderDTO {
    @ApiProperty({ example: 'abc' })
    contact: string;

    @ApiProperty({ example: 'abc' })
    totalExperienceMonths: Member['totalExperienceMonths'];

    @ApiProperty({ example: 'abc' })
    totalExperienceYears: Member['totalExperienceYears'];

    @ApiProperty({ example: 'abc' })
    desiredSalary: Member['desiredSalary'];
}

export class RecommendationCompanyGetItemHeadhuntingApprovedTeamDTO {
    @ApiProperty({ example: 'abc' })
    name: string;

    @ApiProperty()
    district: {
        englishName: string;
        koreanName: string;
    };

    @ApiProperty()
    city: {
        englishName: string;
        koreanName: string;
    };

    @ApiProperty()
    leader: RecommendationCompanyGetItemHeadhuntingApprovedLeaderDTO;
}
export class RecommendationCompanyGetItemHeadhuntingApprovedResponse {
    @ApiProperty()
    member: RecommendationCompanyGetItemHeadhuntingApprovedMemberDTO;

    @ApiProperty()
    team: RecommendationCompanyGetItemHeadhuntingApprovedTeamDTO;
}

export class RecommendationCompanyGetListHeadhuntingApprovedResponse extends PaginationResponse<RecommendationCompanyGetItemHeadhuntingApprovedResponse> {}
