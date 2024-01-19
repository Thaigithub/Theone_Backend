import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards } from '@nestjs/common';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { BaseResponse } from 'utils/generics/base.response';
import { ContractAdminService } from './contract-admin.service';
import { ContractAdminGetListRequest } from './request/contract-admin-get-list.request';
import { ContractAdminRegistrationRequest } from './request/contract-admin-registration.request';
import { ContractAdminGetDetailResponse } from './response/contract-admin-get-detail.response';
import { ContractAdminGetListResponse } from './response/contract-admin-get-list.response';
import { ContractAdminGetTotalContractsResponse } from './response/contract-admin-get-total-contracts.response';

@UseGuards(AuthJwtGuard, AuthRoleGuard)
@Roles(AccountType.ADMIN)
@Controller('/admin/contracts')
export class ContractAdminController {
    constructor(private readonly contractAdminService: ContractAdminService) {}

    @Get()
    async getList(@Query() query: ContractAdminGetListRequest): Promise<BaseResponse<ContractAdminGetListResponse>> {
        return BaseResponse.of(await this.contractAdminService.getList(query));
    }

    @Get('/count')
    async getTotal(@Query() query: ContractAdminGetListRequest): Promise<BaseResponse<ContractAdminGetTotalContractsResponse>> {
        const code = await this.contractAdminService.getTotal(query);
        return BaseResponse.of(code);
    }

    @Get('/:id')
    async getDetail(@Param('id', ParseIntPipe) id: number): Promise<BaseResponse<ContractAdminGetDetailResponse>> {
        return BaseResponse.of(await this.contractAdminService.getDetail(id));
    }

    @Post('/:id/file')
    async createFile(@Param('id', ParseIntPipe) id: number, @Body() body: ContractAdminRegistrationRequest) {
        return BaseResponse.of(await this.contractAdminService.createFile(id, body));
    }

    @Put('/:id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() body: ContractAdminRegistrationRequest) {
        return BaseResponse.of(await this.contractAdminService.update(id, body));
    }
}
