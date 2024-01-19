import { Controller, Get, Param, ParseArrayPipe, ParseIntPipe, Query, Req, UseGuards } from '@nestjs/common';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { AccountIdExtensionRequest } from 'utils/generics/base.request';
import { BaseResponse } from 'utils/generics/base.response';
import { MemberCompanyService } from './member-company.service';
import { MemberCompanyGetListRequest } from './request/member-company-get-list.request';
import { MemberCompanyCountWorkersResponse } from './response/member-company-get-count-worker.response';
import { MemberCompanyGetDetailResponse } from './response/member-company-get-detail.response';
import { MemberCompanyGetListResponse } from './response/member-company-get-list.response';

@Controller('/company/members')
@Roles(AccountType.COMPANY)
@UseGuards(AuthJwtGuard, AuthRoleGuard)
export class MemberCompanyController {
    constructor(private memberCompanyService: MemberCompanyService) {}

    @Get('/worker/count')
    async countPosts(@Req() req: AccountIdExtensionRequest): Promise<BaseResponse<MemberCompanyCountWorkersResponse>> {
        return BaseResponse.of(await this.memberCompanyService.countWorkers(req.user.accountId));
    }

    @Get('/:id')
    async getMemberDetailManpower(@Param('id', ParseIntPipe) id: number): Promise<BaseResponse<MemberCompanyGetDetailResponse>> {
        return BaseResponse.of(await this.memberCompanyService.getMemberDetailManpower(id));
    }

    @Get()
    async getListMember(
        @Query() query: MemberCompanyGetListRequest,
        @Query('occupation', new ParseArrayPipe({ optional: true })) occupation: [string] | undefined,
        @Query('experienceTypeList', new ParseArrayPipe({ optional: true })) experienceTypeList: [string] | undefined,
        @Query('regionList', new ParseArrayPipe({ optional: true })) regionList: [string] | undefined,
    ): Promise<BaseResponse<MemberCompanyGetListResponse>> {
        return BaseResponse.of(await this.memberCompanyService.getList({ ...query, experienceTypeList, occupation, regionList }));
    }
}
