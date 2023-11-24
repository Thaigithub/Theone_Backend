import { AdminMemberRequest } from "presentation/requests/admin-member.request";

export interface AdminMemberUseCase {
  getMembers(query: AdminMemberRequest): Promise<any>;
}

export const AdminMemberUseCase = Symbol('AdminMemberUseCase');
