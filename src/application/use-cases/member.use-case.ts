import { ChangeMemberRequest, GetListRequest } from 'presentation/requests/member.request';
import { GetListResponse, MemberDetailsResponse } from 'presentation/responses/member.response';
import { Response } from 'express';

export interface MemberUseCase {
  getList(query: GetListRequest): Promise<GetListResponse>;
  changeMemberInfo(payload: ChangeMemberRequest): Promise<void>;
  download(memberIds: number[], response: Response): Promise<void>;
  getMemberDetails(id: number): Promise<MemberDetailsResponse>;
}

export const MemberUseCase = Symbol('MemberUseCase');
