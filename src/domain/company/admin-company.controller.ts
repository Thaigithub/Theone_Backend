import { Body, Controller, Get, HttpStatus, Inject, Param, ParseIntPipe, Patch, Query, Res, UseGuards } from '@nestjs/common';
import { ApiConsumes, ApiOperation, ApiProduces, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { CompanyUseCase } from 'domain/company/company.usecase';
import {
    CompanyDownloadRequest,
    CompanySearchRequest,
    CompanyStatusChangeRequest,
} from 'domain/company/request/admin-company.request';
import { CompanyDetailsResponse, CompanyResponse } from 'domain/company/response/company.response';
import { Response } from 'express';
import { PaginationResponse } from 'utils/generics/pageInfo.response';
import { BaseResponse } from '../../utils/generics/base.response';
@ApiTags('[ADMIN] Company management')
@Controller('/admin/companies')
@ApiProduces('application/json')
@ApiConsumes('application/json')
export class AdminCompanyController {
    constructor(@Inject(CompanyUseCase) private readonly companyUseCase: CompanyUseCase) {}
    @Get('/:id/details/')
    @UseGuards(AuthJwtGuard)
    @ApiOperation({
        summary: 'Find company detail',
        description: 'This endpoint retrieves company details in the system.',
    })
    @ApiResponse({ status: HttpStatus.OK, type: BaseResponse })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: BaseResponse })
    async getDetails(@Param('id', ParseIntPipe) id): Promise<BaseResponse<CompanyDetailsResponse>> {
        return BaseResponse.of(new CompanyDetailsResponse(await this.companyUseCase.getDetails(id)));
    }

    @Patch('/:id/status')
    @UseGuards(AuthJwtGuard)
    @ApiOperation({
        summary: 'Change company status',
        description: 'This endpoint chaneg company status in the system.',
    })
    @ApiResponse({ status: HttpStatus.OK, type: BaseResponse })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: BaseResponse })
    async changeStatus(@Param('id', ParseIntPipe) id, @Body() body: CompanyStatusChangeRequest): Promise<void> {
        await this.companyUseCase.changeStatus(id, body.status);
    }

    @Get()
    @UseGuards(AuthJwtGuard)
    @ApiOperation({
        summary: 'Find companies list',
        description: 'This endpoint retrieves comapnies list in the system.',
    })
    @ApiResponse({ status: HttpStatus.OK, type: BaseResponse })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: BaseResponse })
    async getCompanies(@Query() request: CompanySearchRequest): Promise<BaseResponse<PaginationResponse<CompanyResponse>>> {
        return BaseResponse.of(PaginationResponse.of(await this.companyUseCase.getCompanies(request)));
    }

    @Get('/download')
    @UseGuards(AuthJwtGuard)
    @ApiOperation({
        summary: 'Find companies list',
        description: 'This endpoint retrieves comapnies list in the system.',
    })
    @ApiResponse({ status: HttpStatus.OK, type: BaseResponse })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: BaseResponse })
    async download(@Body() request: CompanyDownloadRequest, @Res() response: Response): Promise<void> {
        await this.companyUseCase.download(request, response);
    }
}
