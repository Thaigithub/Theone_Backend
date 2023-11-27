import { Body, Controller, Get, HttpStatus, Inject, Post, UseGuards, Request } from '@nestjs/common';
import { ApiConsumes, ApiOperation, ApiProduces, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CompanyUseCase } from 'application/use-cases/company.use-case';
import { BaseResponse } from '../responses/base.response';
import { JWTAuthGuard } from 'infrastructure/passport/guards/jwt-auth.guard';
import { GetCompanyDetailsResponse, GetCompanySearchResponse } from 'presentation/responses/company.response';
import { Roles, RolesGuard } from 'infrastructure/passport/guards/roles.guard';
import { CompanySearchRequest } from 'presentation/requests/company.request';

@ApiTags('Companies')
@Controller('companies')
@ApiProduces('application/json')
@ApiConsumes('application/json')
export class CompanyController {
    constructor(@Inject (CompanyUseCase) private readonly companyUseCase: CompanyUseCase) {}
    @Get('/company/details')
    @UseGuards(JWTAuthGuard)
    @ApiOperation({
        summary: 'Find company detail',
        description: 'This endpoint retrieves comapny details in the system.',
    })
    @ApiResponse({ status: HttpStatus.OK, type: BaseResponse })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: BaseResponse })
    async getDetails(@Request() req): Promise<BaseResponse<GetCompanyDetailsResponse>> {
        return BaseResponse.of(new GetCompanyDetailsResponse(await this.companyUseCase.getDetails(req.user.id)));
    }
    @Get()
    @UseGuards(JWTAuthGuard)
    @ApiOperation({
        summary: 'Find companies list',
        description: 'This endpoint retrieves comapnies list in the system.',
    })
    @ApiResponse({ status: HttpStatus.OK, type: BaseResponse })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: BaseResponse })
    async getCompanies(@Request() request: CompanySearchRequest): Promise<BaseResponse<GetCompanySearchResponse>> {
        return BaseResponse.of(new GetCompanySearchResponse(await this.companyUseCase.getCompanies(request)));
    }
}