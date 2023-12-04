import {
    ChangeMemberRequest,
    GetMemberListRequest,
    UpsertBankAccountRequest,
    UpsertDisabilityRequest,
    UpsertForeignWorkerRequest,
    UpsertHSTCertificateRequest,
} from 'domain/member/request/member.request';
import { GetMemberListResponse, MemberDetailsResponse } from 'domain/member/response/member.response';
import { Response } from 'express';

export interface MemberUseCase {
    getList(query: GetMemberListRequest): Promise<GetMemberListResponse>;
    changeMemberInfo(id: number, payload: ChangeMemberRequest): Promise<void>;
    download(memberIds: number[], response: Response): Promise<void>;
    getMemberDetails(id: number): Promise<MemberDetailsResponse>;
    upsertBankAccount(id: number, bankAccount: UpsertBankAccountRequest): Promise<void>;
    upsertHSTCertificate(id: number, hstCertificate: UpsertHSTCertificateRequest): Promise<void>;
    upsertForeignWorker(id: number, foreignWorker: UpsertForeignWorkerRequest): Promise<void>;
    upsertDisability(id: number, disability: UpsertDisabilityRequest): Promise<void>;
}

export const MemberUseCase = Symbol('MemberUseCase');
