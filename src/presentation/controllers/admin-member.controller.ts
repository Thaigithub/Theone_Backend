import { Controller, Get, Inject, Query } from '@nestjs/common';
import { AdminMemberUseCase } from 'application/use-cases/member.use-case';
import { AdminMemberRequest } from 'presentation/requests/admin-member.request';
import { BaseResponse } from 'presentation/responses/base.response';
import { GetMembersResponse } from 'presentation/responses/admin-member.response';

@Controller('admin')
export class AdminMemberController {
  constructor(@Inject(AdminMemberUseCase) private readonly adminMemberUseCase: AdminMemberUseCase) {}

  @Get('members')
  async getMembers(@Query() query: AdminMemberRequest): Promise<BaseResponse<GetMembersResponse>> {
    return BaseResponse.of(await this.adminMemberUseCase.getMembers(query));
  }
}
