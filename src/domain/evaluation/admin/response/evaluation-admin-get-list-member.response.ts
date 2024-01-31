import { Member, MemberEvaluation } from '@prisma/client';
import { PaginationResponse } from 'utils/generics/pagination.response';

export class GetListMemberResponse {
    id: MemberEvaluation['id'];
    name: Member['name'];
    contact: Member['name'];
    totalEvaluators: MemberEvaluation['totalEvaluators'];
    averageScore: MemberEvaluation['averageScore'];
}

export class EvaluationAdminGetListMemberResponse extends PaginationResponse<GetListMemberResponse> {}
