import { Controller, Get, Inject, Query, UseGuards } from '@nestjs/common';
import { JWTAuthGuard } from 'infrastructure/passport/guards/jwt-auth.guard';
import { AdminMemberUseCase } from 'application/use-cases/admin-member.use-case';
import { AdminMemberRequest } from 'presentation/requests/admin-member.request';
import { BaseResponse } from 'presentation/responses/base.response';
import { GetMembersResponse } from 'presentation/responses/admin-member.response';


@Controller('admin')
export class AdminMemberController {
  constructor(@Inject(AdminMemberUseCase) private readonly adminMemberUseCase: AdminMemberUseCase) {}

  @Get('members')
  // @UseGuards(JWTAuthGuard)
  async getMembers(@Query() query: AdminMemberRequest): Promise<BaseResponse<GetMembersResponse>> {
    return BaseResponse.of(await this.adminMemberUseCase.getMembers(query));
  }
}
