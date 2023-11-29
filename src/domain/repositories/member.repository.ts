import { Injectable } from '@nestjs/common';
import { BaseRepository } from './base.repository';
import { Member } from 'domain/entities/member.entity';
import { GetListRequest } from 'presentation/requests/member.request';
import { MemberDetailsResponse, MemberResponse } from 'presentation/responses/member.response';

@Injectable()
export abstract class MemberRepository extends BaseRepository<Member> {
  abstract findByQuery(query: GetListRequest, getTotal: boolean): Promise<MemberResponse[] | number>;
  abstract findById(id: number): Promise<MemberDetailsResponse>;
}
