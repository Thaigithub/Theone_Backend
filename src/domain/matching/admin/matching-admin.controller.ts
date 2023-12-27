import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { BaseResponse } from 'utils/generics/base.response';
import { MatchingAdminService } from './matching-admin.service';
import { MatchingAdminGetListRequest } from './request/matching-admin-get-list.request';
import { MatchingAdminGetListResponse } from './response/matching-admin-get-list.response';

@UseGuards(AuthJwtGuard, AuthRoleGuard)
@Roles(AccountType.ADMIN)
@ApiBearerAuth()
@Controller('admin/matching')
@ApiTags('[ADMIN] Matching Management')
export class MatchingAdminController {
    constructor(private readonly matchingAdminService: MatchingAdminService) {}

    @Get()
    async getList(@Query() query: MatchingAdminGetListRequest): Promise<BaseResponse<MatchingAdminGetListResponse>> {
        return BaseResponse.of(await this.matchingAdminService.getList(query));
    }
}
