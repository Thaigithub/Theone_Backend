import { Injectable } from '@nestjs/common';
import { BaseRepository } from './base.repository';
import { AdminMemberRequest } from 'presentation/requests/admin-member.request';

@Injectable()
export abstract class AdminMemberRepository extends BaseRepository<any> {
  abstract findByQuery(query: AdminMemberRequest): Promise<any>;
}
