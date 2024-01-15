import { Controller, Get, Param, ParseArrayPipe, ParseIntPipe, Query, Req, UseGuards } from '@nestjs/common';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { AccountIdExtensionRequest } from 'utils/generics/base.request';
import { BaseResponse } from 'utils/generics/base.response';
import { PageInfo, PaginationResponse } from 'utils/generics/pagination.response';
import { MemberCompanyService } from './member-company.service';
import { MemberCompanyManpowerGetListRequest } from './request/member-company-manpower-get-list.request';
import { MemberCompanyCountWorkersResponse } from './response/member-company-get-count-worker.response';
import { MemberCompanyManpowerGetDetailResponse } from './response/member-company-manpower-get-detail.response';
import { MemberCompanyManpowerGetListResponse } from './response/member-company-manpower-get-list.response';

@Controller('/company/members')
@Roles(AccountType.COMPANY)
@UseGuards(AuthJwtGuard, AuthRoleGuard)
export class MemberCompanyController {
    constructor(private memberCompanyService: MemberCompanyService) {}

    @Get('/count-working-members')
    async countPosts(@Req() req: AccountIdExtensionRequest): Promise<BaseResponse<MemberCompanyCountWorkersResponse>> {
        return BaseResponse.of(await this.memberCompanyService.countWorkers(req.user.accountId));
    }

    @Get(':id/manpower')
    async getMemberDetailManpower(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<BaseResponse<MemberCompanyManpowerGetDetailResponse>> {
        return BaseResponse.of(await this.memberCompanyService.getMemberDetailManpower(id));
    }

    @Get('manpower')
    async getListMember(
        @Query() query: MemberCompanyManpowerGetListRequest,
        @Query('occupation', new ParseArrayPipe({ optional: true })) occupation: [string] | undefined,
        @Query('experienceTypeList', new ParseArrayPipe({ optional: true })) experienceTypeList: [string] | undefined,
        @Query('regionList', new ParseArrayPipe({ optional: true })) regionList: [string] | undefined,
    ): Promise<BaseResponse<MemberCompanyManpowerGetListResponse>> {
        query = { ...query, experienceTypeList, occupation, regionList };
        const list = await this.memberCompanyService.getList(query);
        const total = await this.memberCompanyService.getTotal(query);
        const paginationResponse = new PaginationResponse(list, new PageInfo(total));
        return BaseResponse.of(paginationResponse);
    }
}
