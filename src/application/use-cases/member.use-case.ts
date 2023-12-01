import {
  ChangeMemberRequest,
  GetListRequest,
  UpsertBankAccountRequest,
  UpsertForeignWorkerRequest,
  UpsertHSTCertificateRequest,
} from 'presentation/requests/member.request';
import { GetListResponse, MemberDetailsResponse } from 'presentation/responses/member.response';
import { Response } from 'express';

export interface MemberUseCase {
  getList(query: GetListRequest): Promise<GetListResponse>;
  changeMemberInfo(payload: ChangeMemberRequest): Promise<void>;
  download(memberIds: number[], response: Response): Promise<void>;
  getMemberDetails(id: number): Promise<MemberDetailsResponse>;
  upsertBankAccount(id: number, bankAccount: UpsertBankAccountRequest): Promise<void>;
  upsertHSTCertificate(id: number, hstCertificate: UpsertHSTCertificateRequest): Promise<void>;
  upsertForeignWorker(id: number, foreignWorker: UpsertForeignWorkerRequest): Promise<void>;
}

export const MemberUseCase = Symbol('MemberUseCase');
