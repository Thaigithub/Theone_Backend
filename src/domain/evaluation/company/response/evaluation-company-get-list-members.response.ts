import { Member, MemberEvaluationByCompany, Site } from '@prisma/client';
import { PaginationResponse } from 'utils/generics/pagination.response';

class GetListMemberResponse {
    id: MemberEvaluationByCompany['id'];
    memberName: Member['name'];
    contact: Member['contact'];
    siteName: Site['name'];
    score: MemberEvaluationByCompany['score'];
}

export class EvaluationCompanyGetListMemberResponse extends PaginationResponse<GetListMemberResponse> {}
