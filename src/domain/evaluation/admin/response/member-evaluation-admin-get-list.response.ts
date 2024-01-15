import { Member, MemberEvaluation } from '@prisma/client';
import { PaginationResponse } from 'utils/generics/pagination.response';

export class MemberEvaluationResponse {
    id: MemberEvaluation['id'];
    name: Member['name'];
    contact: Member['name'];
    totalEvaluators: MemberEvaluation['totalEvaluators'];
    averageScore: MemberEvaluation['averageScore'];
}

export class MemberEvaluationAdminGetListResponse extends PaginationResponse<MemberEvaluationResponse> {}
