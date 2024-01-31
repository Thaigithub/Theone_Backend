import {
    Body,
    Controller,
    Delete,
    Get,
    Inject,
    Param,
    ParseIntPipe,
    Post,
    Put,
    Query,
    Req,
    Request,
    UseGuards,
} from '@nestjs/common';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { BaseRequest } from 'utils/generics/base.request';
import { BaseResponse } from 'utils/generics/base.response';
import { LicenseService } from './license-member.service';
import { LicenseMemberGetListRequest } from './request/license-member-get-list.request';
import { LicenseMemberUpsertRequest } from './request/license-member-upsert.request';
import { LicenseMemberGetDetailResponse } from './response/license-member-get-detail.response';
import { LicenseMemberGetListResponse } from './response/license-member-get-list.response';

@Controller('/member/licenses')
@Roles(AccountType.MEMBER)
@UseGuards(AuthJwtGuard, AuthRoleGuard)
export class MemberLicenseController {
    constructor(@Inject(LicenseService) private licenseService: LicenseService) {}
    @Post()
    async create(@Body() request: LicenseMemberUpsertRequest, @Request() req: BaseRequest): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.licenseService.create(req.user.accountId, request));
    }

    @Get()
    async getList(
        @Query() query: LicenseMemberGetListRequest,
        @Request() req: BaseRequest,
    ): Promise<BaseResponse<LicenseMemberGetListResponse>> {
        return BaseResponse.of(await this.licenseService.getList(req.user.accountId, query));
    }

    @Get('/:id')
    async getDetail(
        @Req() req: BaseRequest,
        @Param('id', ParseIntPipe) id: number,
    ): Promise<BaseResponse<LicenseMemberGetDetailResponse>> {
        return BaseResponse.of(await this.licenseService.getDetail(req.user.accountId, id));
    }

    @Put('/:id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Req() req: BaseRequest,
        @Body() request: LicenseMemberUpsertRequest,
    ): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.licenseService.update(req.user.accountId, id, request));
    }

    @Delete('/:id')
    async delete(@Req() req: BaseRequest, @Param('id', ParseIntPipe) id: number): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.licenseService.delete(req.user.accountId, id));
    }
}
