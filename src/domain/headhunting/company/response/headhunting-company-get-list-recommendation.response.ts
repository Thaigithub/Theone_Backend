import { ApiProperty } from '@nestjs/swagger';
import { Member } from '@prisma/client';
import { ApplicationCompanyApplicantsSpecialDTO } from 'domain/application/company/dto/applicants/application-company-applicants-member.dto';
import { PaginationResponse } from 'utils/generics/pagination.response';

export class RecommendationCompanyGetItemHeadhuntingApprovedMemberDTO {
    @ApiProperty({ example: 'abc' })
    public name: Member['name'];

    @ApiProperty({ example: 'abc' })
    public contact: Member['contact'];

    @ApiProperty({ example: 'abc' })
    public totalExperienceMonths: Member['totalExperienceMonths'];

    @ApiProperty({ example: 'abc' })
    public totalExperienceYears: Member['totalExperienceYears'];

    @ApiProperty({ type: [ApplicationCompanyApplicantsSpecialDTO] })
    public specialLicenses: ApplicationCompanyApplicantsSpecialDTO[];

    @ApiProperty({ example: 'abc' })
    public desiredSalary: Member['desiredSalary'];

    @ApiProperty()
    public city: {
        englishName: string;
        koreanName: string;
    };

    @ApiProperty()
    public district: {
        englishName: string;
        koreanName: string;
    };
}

export class RecommendationCompanyGetItemHeadhuntingApprovedLeaderDTO {
    @ApiProperty({ example: 'abc' })
    public contact: string;

    @ApiProperty({ example: 'abc' })
    public totalExperienceMonths: Member['totalExperienceMonths'];

    @ApiProperty({ example: 'abc' })
    public totalExperienceYears: Member['totalExperienceYears'];

    @ApiProperty({ example: 'abc' })
    public desiredSalary: Member['desiredSalary'];
}

export class RecommendationCompanyGetItemHeadhuntingApprovedTeamDTO {
    @ApiProperty({ example: 'abc' })
    public name: string;

    @ApiProperty()
    public district: {
        englishName: string;
        koreanName: string;
    };

    @ApiProperty()
    public city: {
        englishName: string;
        koreanName: string;
    };

    @ApiProperty()
    public leader: RecommendationCompanyGetItemHeadhuntingApprovedLeaderDTO;
}
export class RecommendationCompanyGetItemHeadhuntingApprovedResponse {
    @ApiProperty()
    public member: RecommendationCompanyGetItemHeadhuntingApprovedMemberDTO;

    @ApiProperty()
    public team: RecommendationCompanyGetItemHeadhuntingApprovedTeamDTO;
}

export class RecommendationCompanyGetListHeadhuntingApprovedResponse extends PaginationResponse<RecommendationCompanyGetItemHeadhuntingApprovedResponse> {}
