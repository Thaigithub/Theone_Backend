import { Inject, Injectable } from "@nestjs/common"
import { AdminMemberUseCase  } from "application/use-cases/member.use-case"
import { AdminMemberRepository } from "domain/repositories/member.repository"
import { AdminMemberRequest } from "presentation/requests/admin-member.request";
import { GetMembersResponse } from "presentation/responses/admin-member.response";

@Injectable()
export class AdminMemberUseCaseImpl implements AdminMemberUseCase {
  constructor(
    @Inject(AdminMemberRepository) private adminMemberRepository: AdminMemberRepository
  ) {}

  async getMembers(query: AdminMemberRequest): Promise<GetMembersResponse> {
    const members = await this.adminMemberRepository.findByQuery(query);
    const total = members.length;
    return new GetMembersResponse(members, total);
  }
}