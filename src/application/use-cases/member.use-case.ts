import { AdminMemberRequest } from 'presentation/requests/admin-member.request';
import { GetMembersResponse } from 'presentation/responses/admin-member.response';

export interface AdminMemberUseCase {
  getMembers(query: AdminMemberRequest): Promise<GetMembersResponse>;
}

export const AdminMemberUseCase = Symbol('AdminMemberUseCase');
