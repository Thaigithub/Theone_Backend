import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common';
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
@Controller('admin/contract')
export class ContractAdminController {
    constructor(private readonly contractAdminService: ContractAdminService) {}

    @Get()
    async getList(@Query() query: ContractAdminGetListRequest): Promise<BaseResponse<ContractAdminGetListResponse>> {
        const code = await this.contractAdminService.getList(query);
        return BaseResponse.of(code);
    }

    @Get('/contract-count')
    async getTotalContracts(
        @Query() query: ContractAdminGetListRequest,
    ): Promise<BaseResponse<ContractAdminGetTotalContractsResponse>> {
        const code = await this.contractAdminService.getTotalContracts(query);
        return BaseResponse.of(code);
    }

    @Get(':id')
    async getDetail(@Param('id', ParseIntPipe) id: number): Promise<BaseResponse<ContractAdminGetDetailResponse>> {
        const code = await this.contractAdminService.getDetail(id);
        return BaseResponse.of(code);
    }

    @Post(':id/registration')
    async registrationContract(@Param('id', ParseIntPipe) id: number, @Body() body: ContractAdminRegistrationRequest) {
        const upload = await this.contractAdminService.registrationContract(id, body);
        return BaseResponse.of(upload);
    }

    @Post(':id/edit')
    async editContract(@Param('id', ParseIntPipe) id: number, @Body() body: ContractAdminRegistrationRequest) {
        const upload = await this.contractAdminService.editContract(id, body);
        return BaseResponse.of(upload);
    }
}
