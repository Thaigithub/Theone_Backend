import { Injectable } from '@nestjs/common';
import { BaseRepository } from './base.repository';
import { Member } from 'domain/entities/member.entity';
import { Member as MemberPrisma } from '@prisma/client';
import { ChangeMemberRequest, GetListRequest, UpsertBankAccountRequest } from 'presentation/requests/member.request';
import { MemberDetailsResponse, MemberResponse } from 'presentation/responses/member.response';

@Injectable()
export abstract class MemberRepository extends BaseRepository<Member> {
  abstract findByQuery(query: GetListRequest): Promise<MemberResponse[]>;
  abstract countByQuery(query: GetListRequest): Promise<number>;
  abstract findByIds(memberIds: number[]): Promise<MemberPrisma[]>;
  abstract findById(id: number): Promise<MemberDetailsResponse>;
  abstract findIdByAccountId(id: number): Promise<number>;
  abstract updateMember(payload: ChangeMemberRequest): Promise<void>;
  abstract upsertBankAccount(id: number, request: UpsertBankAccountRequest): Promise<void>;
}
