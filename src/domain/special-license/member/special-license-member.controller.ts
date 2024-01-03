import { Body, Controller, Get, Inject, Param, ParseIntPipe, Post, Put, Query, Req, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiProduces, ApiTags } from '@nestjs/swagger';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { AccountIdExtensionRequest } from 'utils/generics/base.request';
import { BaseResponse } from 'utils/generics/base.response';
import { SpecialLicenseMemberGetListRequest } from './request/special-license-member-get-list.request';
import { SpecialLicenseMemberUpsertRequest } from './request/special-license-member-upsert.request';
import { SpecialLicenseMemberGetDetailResponse } from './response/special-license-member-get-detail.response';
import { SpecialLicenseMemberGetListResponse } from './response/special-license-member-get-list.response';
import { SpecialLicenseService } from './special-license-member.service';

@ApiTags('[MEMBER] Special License Management')
@Controller('member/special-licenses')
@ApiBearerAuth()
@Roles(AccountType.MEMBER)
@UseGuards(AuthJwtGuard, AuthRoleGuard)
@ApiProduces('application/json')
@ApiConsumes('application/json')
export class MemberSpecialLicenseController {
    constructor(@Inject(SpecialLicenseService) private readonly specialLicenseService: SpecialLicenseService) {}
    @Post()
    async create(
        @Body() request: SpecialLicenseMemberUpsertRequest,
        @Request() req: AccountIdExtensionRequest,
    ): Promise<BaseResponse<void>> {
        await this.specialLicenseService.create(req.user.accountId, request);
        return BaseResponse.ok();
    }

    @Get()
    async getSpecialLicenses(
        @Query() query: SpecialLicenseMemberGetListRequest,
        @Request() req,
    ): Promise<BaseResponse<SpecialLicenseMemberGetListResponse>> {
        return BaseResponse.of(await this.specialLicenseService.getList(req.user.accountId, query));
    }

    @Get('/:id')
    async getDetail(
        @Req() req: AccountIdExtensionRequest,
        @Param('id', ParseIntPipe) id: number,
    ): Promise<BaseResponse<SpecialLicenseMemberGetDetailResponse>> {
        return BaseResponse.of(await this.specialLicenseService.getDetail(req.user.accountId, id));
    }

    @Put('/:id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Req() req: AccountIdExtensionRequest,
        @Body() request: SpecialLicenseMemberUpsertRequest,
    ): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.specialLicenseService.update(req.user.accountId, id, request));
    }
}
