import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, Req, UseGuards } from '@nestjs/common';
import { AccountType, MemberLevel } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthMemberLevelGuard, MemberLevelPermissions } from 'domain/auth/auth-member-level.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { BaseRequest } from 'utils/generics/base.request';
import { BaseResponse } from 'utils/generics/base.response';
import { LaborConsultationMemberService } from './labor-consultation-member.service';
import { LaborConsultationMemberCreateRequest } from './request/labor-consultation-member-create.request';
import { LaborConsultationMemberGetListRequest } from './request/labor-consultation-member-get-list.request';
import { LaborConsultationMemberGetDetailResponse } from './response/labor-consultation-member-get-detail.response';
import { LaborConsultationMemberGetListResponse } from './response/labor-consultation-member-get-list.response';

@Controller('/member/labor-consultations')
@UseGuards(AuthJwtGuard, AuthRoleGuard)
@Roles(AccountType.MEMBER)
export class LaborConsultationMemberController {
    constructor(private laboConsultationMemberService: LaborConsultationMemberService) {}

    @Get()
    async getList(
        @Query() query: LaborConsultationMemberGetListRequest,
        @Req() req: BaseRequest,
    ): Promise<BaseResponse<LaborConsultationMemberGetListResponse>> {
        return BaseResponse.of(await this.laboConsultationMemberService.getList(req.user.accountId, query));
    }

    @UseGuards(AuthMemberLevelGuard)
    @MemberLevelPermissions([MemberLevel.SILVER, MemberLevel.GOLD, MemberLevel.PLATINUM])
    @Post()
    async create(@Body() body: LaborConsultationMemberCreateRequest, @Req() req: BaseRequest): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.laboConsultationMemberService.create(req.user.accountId, body));
    }

    @Get('/:id')
    async getDetail(
        @Param('id', ParseIntPipe) id: number,
        @Req() req: BaseRequest,
    ): Promise<BaseResponse<LaborConsultationMemberGetDetailResponse>> {
        return BaseResponse.of(await this.laboConsultationMemberService.getDetail(req.user.accountId, id));
    }
}
