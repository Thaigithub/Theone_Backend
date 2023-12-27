import { Body, Controller, Get, Param, ParseIntPipe, Patch, Put, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiProduces, ApiTags } from '@nestjs/swagger';
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

@ApiTags('[COMPANY] Contract Management')
@Controller('/company/contracts')
@Roles(AccountType.COMPANY)
@UseGuards(AuthJwtGuard, AuthRoleGuard)
@ApiBearerAuth()
@ApiProduces('application/json')
@ApiConsumes('application/json')
export class ContractCompanyController {
    constructor(private contractCompanyService: ContractCompanyService) {}

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
