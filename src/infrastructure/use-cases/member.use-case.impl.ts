import { Inject, Injectable } from '@nestjs/common';
import { MemberUseCase } from 'application/use-cases/member.use-case';
import { MemberRepository } from 'domain/repositories/member.repository';
import { GetListRequest } from 'presentation/requests/member.request';
import { GetListResponse, MemberDetailsResponse, MemberResponse } from 'presentation/responses/member.response';

@Injectable()
export class MemberUseCaseImpl implements MemberUseCase {
  constructor(@Inject(MemberRepository) private memberRepository: MemberRepository) {}

  async getList(query: GetListRequest): Promise<GetListResponse> {
    const members = (await this.memberRepository.findByQuery(query, false)) as MemberResponse[];
    const total = (await this.memberRepository.findByQuery(query, true)) as number;
    return new GetListResponse(members, total);
  }
  async getMemberDetails(id: number): Promise<MemberDetailsResponse> {
    return await this.memberRepository.findById(id);
  }
}
