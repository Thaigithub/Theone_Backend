import { ApiProperty } from '@nestjs/swagger';
import { PaginationResponse } from 'utils/generics/pageInfo.response';
import { ApplicationCompanyApplicantsMemberDTO } from '../dto/application-company-applicants-member.dto';
import { ApplicationCompanyApplicantsPostDTO } from '../dto/application-company-applicants-post.dto';
import { ApplicationCompanyApplicantsTeamDTO } from '../dto/application-company-applicants-team.dto';

export class ApplicationCompanyGetListApplicantsItemResponse {
    @ApiProperty({ example: '2023-12-12T06:49:24.646Z' })
    public assignedAt: Date;

    @ApiProperty({ type: ApplicationCompanyApplicantsPostDTO })
    public post: ApplicationCompanyApplicantsPostDTO;

    @ApiProperty({ type: ApplicationCompanyApplicantsMemberDTO })
    public member: ApplicationCompanyApplicantsMemberDTO;

    @ApiProperty({ type: ApplicationCompanyApplicantsTeamDTO })
    public team: ApplicationCompanyApplicantsTeamDTO;
}

export class ApplicationCompanyGetListApplicantsResponse extends PaginationResponse<ApplicationCompanyGetListApplicantsItemResponse> {}
