import { Controller, Get, Inject, Param, Query, UseGuards } from '@nestjs/common';
import { JWTAuthGuard } from 'infrastructure/passport/guards/jwt-auth.guard';
import { AdminMemberUseCase as AdminMemberUseCase } from 'application/use-cases/admin-user.use-case';
import { AdminMemberRequest } from 'presentation/requests/admin-member.request';
import { BaseResponse } from 'presentation/responses/base.response';


@Controller('admin')
export class AdminMemberController {
  constructor(@Inject(AdminMemberUseCase) private readonly adminMemberUseCase: AdminMemberUseCase) {}

  @Get('members')
  // @UseGuards(JWTAuthGuard)
  async getMembers(@Query() query: AdminMemberRequest): Promise<BaseResponse<any>> {
    return BaseResponse.of(await this.adminMemberUseCase.getMembers(query));
  }
}
