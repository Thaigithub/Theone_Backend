import { ApiProperty } from '@nestjs/swagger';
import { ApplicationCompanyApplicantsMemberDTO } from 'domain/application/company/dto/applicants/application-company-applicants-member.dto';
import { ApplicationCompanyApplicantsTeamDTO } from 'domain/application/company/dto/applicants/application-company-applicants-team.dto';
import { PaginationResponse } from 'utils/generics/pageInfo.response';

export class RecommendationCompanyGetItemHeadhuntingApprovedResponse {
    @ApiProperty({ type: ApplicationCompanyApplicantsMemberDTO })
    public member: ApplicationCompanyApplicantsMemberDTO;

    @ApiProperty({ type: ApplicationCompanyApplicantsTeamDTO })
    public team: ApplicationCompanyApplicantsTeamDTO;
}

export class RecommendationCompanyGetListHeadhuntingApprovedResponse extends PaginationResponse<RecommendationCompanyGetItemHeadhuntingApprovedResponse> {}
