import { Controller, Delete, Get, Param, ParseIntPipe, Query, Request, UseGuards } from '@nestjs/common';
import { AccountType } from '@prisma/client';
import { PaginationRequest } from 'utils/generics/pagination.request';
import { AccountIdExtensionRequest } from '../../../utils/generics/base.request';
import { BaseResponse } from '../../../utils/generics/base.response';
import { AuthJwtGuard } from '../../auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from '../../auth/auth-role.guard';
import { NoticeCompanyService } from './notice-company.service';
import { NoticeCompanyGetListResponse } from './response/company-notice.response';

@Controller('/company/notices')
@Roles(AccountType.COMPANY)
@UseGuards(AuthJwtGuard, AuthRoleGuard)
export class NoticeCompanyController {
    constructor(private noticeCompanyService: NoticeCompanyService) {}

    @Get()
    async getList(
        @Query() query: PaginationRequest,
        @Request() request: AccountIdExtensionRequest,
    ): Promise<BaseResponse<NoticeCompanyGetListResponse>> {
        return BaseResponse.of(await this.noticeCompanyService.getList(query, request.user.accountId));
    }

    @Delete('/:id')
    async deleteNotice(
        @Param('id', ParseIntPipe) id: number,
        @Request() request: AccountIdExtensionRequest,
    ): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.noticeCompanyService.delete(id, request.user.accountId));
    }
}
