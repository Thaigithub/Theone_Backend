import { Body, Controller, Get, HttpStatus, Param, ParseIntPipe, Patch, Put, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiProduces, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { BaseResponse } from 'utils/generics/base.response';
import { ApiOkResponsePaginated } from 'utils/generics/pagination.decorator';
import { ContractCompanyService } from './contract-company.service';
import { ContractCompanyCreateRequest } from './request/contract-company-create.request';
import { ContractCompanyGetListForSiteRequest } from './request/contract-company-get-list-for-site.request';
import { ContractCompanyUpdateRequest } from './request/contract-company-update.request';
import { ContractCompanyGetDetailResponse } from './response/contract-company-get-detail.response';
import { ContractCompanyGetListForSiteResponse, GetListForSite } from './response/contract-company-get-list-for-site.response';
import { ContractCompanyCountContractsResponse } from './response/contract-company-get-count-contract.response';

@ApiTags('[COMPANY] Contract Management')
@Controller('/company/contracts')
@Roles(AccountType.COMPANY)
@UseGuards(AuthJwtGuard, AuthRoleGuard)
@ApiBearerAuth()
@ApiProduces('application/json')
@ApiConsumes('application/json')
export class ContractCompanyController {
    constructor(private contractCompanyService: ContractCompanyService) {}

    @Get('/count')
    @ApiOperation({
        summary: 'count contracts that company have responsibility (use for dashboard)',
        description: 'Company retrieve the total contract that is active',
    })
    @ApiResponse({ status: HttpStatus.ACCEPTED, type: ContractCompanyCountContractsResponse })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'The company account does not exist', type: BaseResponse })
    async countPosts(@Req() req: any): Promise<BaseResponse<ContractCompanyCountContractsResponse>> {
        return BaseResponse.of(await this.contractCompanyService.countContracts(req.user.accountId));
    }

    @Get('/site/:id')
    @ApiOperation({
        summary: 'Get contracts for specific site',
        description: 'Company retrieve information of the contract site',
    })
    @ApiOkResponsePaginated(GetListForSite)
    async getContractOnSite(
        @Param('id', ParseIntPipe) id: number,
        @Req() request: any,
        @Query() query: ContractCompanyGetListForSiteRequest,
    ): Promise<BaseResponse<ContractCompanyGetListForSiteResponse>> {
        return BaseResponse.of(await this.contractCompanyService.getContractOnSite(id, request.user.accountId, query));
    }

    @Get('/:id')
    async getDetailContract(
        @Param('id', ParseIntPipe) id: number,
        @Req() req: any,
    ): Promise<BaseResponse<ContractCompanyGetDetailResponse>> {
        return BaseResponse.of(await this.contractCompanyService.getDetail(id, req.user.accountId));
    }

    @Patch('/:id')
    async updateContract(
        @Param('id', ParseIntPipe) id: number,
        @Req() req: any,
        @Body() body: ContractCompanyUpdateRequest,
    ): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.contractCompanyService.update(id, req.user.accountId, body));
    }

    @Put()
    async createContract(@Body() body: ContractCompanyCreateRequest, @Req() request: any): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.contractCompanyService.createContract(request.user.accountId, body));
    }
}
