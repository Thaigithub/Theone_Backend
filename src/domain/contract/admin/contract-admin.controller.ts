import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { BaseResponse } from 'utils/generics/base.response';
import { ContractAdminService } from './contract-admin.service';
import { ContractAdminGetListRequest } from './request/contract-admin-get-list.request';
import { ContractAdminUpsertFileRequest } from './request/contract-admin-upsert-file.request';
import { ContractAdminGetListResponse } from './response/contract-admin-get-list.response';
import { ContractAdminGetCountRequest } from './request/contract-admin-get-count.request';
import { CountResponse } from 'utils/generics/count.response';

@UseGuards(AuthJwtGuard, AuthRoleGuard)
@Roles(AccountType.ADMIN)
@Controller('/admin/contracts')
export class ContractAdminController {
    constructor(private contractAdminService: ContractAdminService) {}

    @Get()
    async getList(@Query() query: ContractAdminGetListRequest): Promise<BaseResponse<ContractAdminGetListResponse>> {
        return BaseResponse.of(await this.contractAdminService.getList(query));
    }

    @Get('/count')
    async getCount(@Query() query: ContractAdminGetCountRequest): Promise<BaseResponse<CountResponse>> {
        return BaseResponse.of(await this.contractAdminService.getCount(query));
    }

    @Post('/:id/file')
    async createFile(@Param('id', ParseIntPipe) id: number, @Body() body: ContractAdminUpsertFileRequest) {
        return BaseResponse.of(await this.contractAdminService.createFile(id, body));
    }

    @Patch('/:id/file')
    async updateFile(@Param('id', ParseIntPipe) id: number, @Body() body: ContractAdminUpsertFileRequest) {
        return BaseResponse.of(await this.contractAdminService.updateFile(id, body));
    }
}
