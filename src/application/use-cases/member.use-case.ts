import { GetListRequest } from 'presentation/requests/member.request';
import { GetListResponse, MemberDetailsResponse } from 'presentation/responses/member.response';

export interface MemberUseCase {
  getList(query: GetListRequest): Promise<GetListResponse>;
  getMemberDetails(id: number): Promise<MemberDetailsResponse>;
}

export const MemberUseCase = Symbol('MemberUseCase');
