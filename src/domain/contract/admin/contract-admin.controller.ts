import { Controller, Get, HttpStatus, Param, ParseIntPipe, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { BaseResponse } from 'utils/generics/base.response';
import { ApiOkResponsePaginated } from 'utils/generics/pagination.decorator.reponse';
import { ContractAdminService } from './contract-admin.service';
import { ContractAdminGetListRequest } from './request/contract-admin-get-list.request';
import { ContractAdminGetDetailResponse } from './response/contract-admin-get-detail.response';
import { ContractAdminGetItemResponse, ContractAdminGetListResponse } from './response/contract-admin-get-list.response';
import { ContractAdminGetTotalContractsResponse } from './response/contract-admin-get-total-contracts.response';

@UseGuards(AuthJwtGuard, AuthRoleGuard)
@Roles(AccountType.ADMIN)
@ApiBearerAuth()
@Controller('admin/contract')
@ApiTags('[ADMIN] Contract Management')
export class ContractAdminController {
    constructor(private readonly contractAdminService: ContractAdminService) {}

    @Get()
    @ApiOperation({
        summary: 'Listing code',
        description: 'Admin can search code by code type',
    })
    @ApiOkResponsePaginated(ContractAdminGetItemResponse)
    async getList(@Query() query: ContractAdminGetListRequest): Promise<BaseResponse<ContractAdminGetListResponse>> {
        const code = await this.contractAdminService.getList(query);
        return BaseResponse.of(code);
    }

    @Get('/contract-count')
    @ApiOperation({
        summary: 'Number of contracts',
        description: 'Admin can view total contracts',
    })
    async getTotalContracts(
        @Query() query: ContractAdminGetListRequest,
    ): Promise<BaseResponse<ContractAdminGetTotalContractsResponse>> {
        const code = await this.contractAdminService.getTotalContracts(query);
        return BaseResponse.of(code);
    }

    @Get(':id')
    @ApiOperation({
        summary: 'Get contract detail',
        description: 'Admin can view contract detail',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        type: ContractAdminGetDetailResponse,
    })
    async getDetail(@Param('id', ParseIntPipe) id: number): Promise<BaseResponse<ContractAdminGetDetailResponse>> {
        const code = await this.contractAdminService.getDetail(id);
        return BaseResponse.of(code);
    }
}
