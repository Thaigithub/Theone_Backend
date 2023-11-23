import { Inject, Injectable } from "@nestjs/common"
import { AdminMemberUseCase  } from "application/use-cases/admin-user.use-case"
import { AdminMemberRepository } from "domain/repositories/admin-member.repository"
import { AdminMemberRequest } from "presentation/requests/admin-member.request";

@Injectable()
export class AdminMemberUseCaseImpl implements AdminMemberUseCase {
  constructor(
    @Inject(AdminMemberRepository) private adminMemberRepository: AdminMemberRepository
  ) {}

  async getMembers(query: AdminMemberRequest): Promise<any> {
    return await this.adminMemberRepository.findByQuery(query)
  }
}