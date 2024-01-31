import { Body, Controller, Get, Param, ParseIntPipe, Patch, Query, Req, UseGuards } from '@nestjs/common';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { BaseRequest } from 'utils/generics/base.request';
import { BaseResponse } from 'utils/generics/base.response';
import { ApplicationMemberService } from './application-member.service';
import { ApplicationMemberGetListOfferRequest } from './request/application-member-get-list-offer.request';
import { ApplicationMemberGetListRequest } from './request/application-member-get-list.request';
import { ApplicationMemberUpdateStatusRequest } from './request/application-member-update-status.request';
import { ApplicationMemberGetDetailResponse } from './response/application-member-get-detail.response';
import { ApplicationMemberGetListOfferResponse } from './response/application-member-get-list-offer.response';
import { ApplicationMemberGetListResponse } from './response/application-member-get-list.response';

@Controller('/member/applications')
@Roles(AccountType.MEMBER)
@UseGuards(AuthJwtGuard, AuthRoleGuard)
export class ApplicationMemberController {
    constructor(private applicationMemberService: ApplicationMemberService) {}

    @Patch('/:id/status')
    async updateStatus(
        @Param('id', ParseIntPipe) id: number,
        @Req() request: BaseRequest,
        @Body() body: ApplicationMemberUpdateStatusRequest,
    ): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.applicationMemberService.updateStatus(id, request.user.accountId, body));
    }

    @Get('/offer')
    async getListOffer(
        @Query() body: ApplicationMemberGetListOfferRequest,
        @Req() request: BaseRequest,
    ): Promise<BaseResponse<ApplicationMemberGetListOfferResponse>> {
        return BaseResponse.of(await this.applicationMemberService.getListOffer(request.user.accountId, body));
    }

    @Get('/count')
    async getTotal(@Req() request: BaseRequest): Promise<BaseResponse<number>> {
        return BaseResponse.of(await this.applicationMemberService.getTotal(request.user.accountId));
    }

    @Get('/in-progress/count')
    async getTotalInProgress(@Req() request: BaseRequest): Promise<BaseResponse<number>> {
        return BaseResponse.of(await this.applicationMemberService.getTotal(request.user.accountId, true));
    }

    @Get('/:id')
    async getDetail(
        @Param('id', ParseIntPipe) id: number,
        @Req() req: BaseRequest,
    ): Promise<BaseResponse<ApplicationMemberGetDetailResponse>> {
        return BaseResponse.of(await this.applicationMemberService.getDetail(id, req.user.accountId));
    }

    @Get()
    async getList(
        @Req() request: BaseRequest,
        @Query() query: ApplicationMemberGetListRequest,
    ): Promise<BaseResponse<ApplicationMemberGetListResponse>> {
        return BaseResponse.of(await this.applicationMemberService.getList(request.user.accountId, query));
    }
}
