import { Application } from '@prisma/client';
import { PaginationResponse } from 'utils/generics/pagination.response';
import { ApplicationCompanyApplicantsMemberDTO } from '../dto/application-company-applicants-member.dto';
import { ApplicationCompanyApplicantsTeamDTO } from '../dto/application-company-applicants-team.dto';

export class ApplicationCompanyGetListApplicantsItemResponse {
    id: Application['id'];
    assignedAt: Application['assignedAt'];
    member: ApplicationCompanyApplicantsMemberDTO;
    team: ApplicationCompanyApplicantsTeamDTO;
}

export class ApplicationCompanyGetListApplicantsResponse extends PaginationResponse<ApplicationCompanyGetListApplicantsItemResponse> {}
