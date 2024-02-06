import { Controller, Get, Param, ParseArrayPipe, ParseIntPipe, Post, Query, Req, UseGuards } from '@nestjs/common';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { BaseRequest } from 'utils/generics/base.request';
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
    async countPosts(@Req() req: BaseRequest): Promise<BaseResponse<MemberCompanyCountWorkersResponse>> {
        return BaseResponse.of(await this.memberCompanyService.countWorkers(req.user.accountId));
    }

    @Get('/:id')
    async getDetail(
        @Req() req: BaseRequest,
        @Param('id', ParseIntPipe) id: number,
    ): Promise<BaseResponse<MemberCompanyGetDetailResponse>> {
        return BaseResponse.of(await this.memberCompanyService.getDetail(req.user.accountId, id));
    }

    @Get()
    async getListMember(
        @Req() req: BaseRequest,
        @Query() query: MemberCompanyGetListRequest,
        @Query('occupation', new ParseArrayPipe({ optional: true })) occupation: [string] | undefined,
        @Query('experienceTypeList', new ParseArrayPipe({ optional: true })) experienceTypeList: [string] | undefined,
        @Query('regionList', new ParseArrayPipe({ optional: true })) regionList: [string] | undefined,
    ): Promise<BaseResponse<MemberCompanyGetListResponse>> {
        return BaseResponse.of(
            await this.memberCompanyService.getList(req.user.accountId, { ...query, experienceTypeList, occupation, regionList }),
        );
    }

    @Post('/:id/check')
    async verifyMember(@Req() req: BaseRequest, @Param('id', ParseIntPipe) id: number): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.memberCompanyService.checkMember(req.user.accountId, id));
    }
}
