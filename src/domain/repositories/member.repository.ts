import { Injectable } from '@nestjs/common';
import { BaseRepository } from './base.repository';
import { Member } from 'domain/entities/member.entity';
import { Member as MemberPrisma } from '@prisma/client';
import {
  ChangeMemberRequest,
  GetMemberListRequest,
  UpsertBankAccountRequest,
  UpsertForeignWorkerRequest,
  UpsertHSTCertificateRequest,
  UpsertDisabilityRequest,
} from 'presentation/requests/member.request';
import { MemberDetailsResponse, MemberResponse } from 'presentation/responses/member.response';

@Injectable()
export abstract class MemberRepository extends BaseRepository<Member> {
  abstract findMemberId(accountId: number): Promise<number>;
  abstract findByQuery(query: GetMemberListRequest): Promise<MemberResponse[]>;
  abstract countByQuery(query: GetMemberListRequest): Promise<number>;
  abstract findByIds(memberIds: number[]): Promise<MemberPrisma[]>;
  abstract findById(id: number): Promise<MemberDetailsResponse>;
  abstract findIdByAccountId(id: number): Promise<number>;
  abstract updateMember(id: number, payload: ChangeMemberRequest): Promise<void>;
  abstract upsertBankAccount(id: number, request: UpsertBankAccountRequest): Promise<void>;
  abstract upsertHSTCertificate(id: number, request: UpsertHSTCertificateRequest): Promise<void>;
  abstract upsertForeignWorker(id: number, request: UpsertForeignWorkerRequest): Promise<void>;
  abstract upsertDisability(id: number, request: UpsertDisabilityRequest): Promise<void>;
}
