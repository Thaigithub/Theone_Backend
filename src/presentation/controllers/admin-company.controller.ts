import { Body, Query, Param, Controller, Get, HttpStatus, Inject, Post, UseGuards, Res } from '@nestjs/common';
import { ApiConsumes, ApiOperation, ApiProduces, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CompanyUseCase } from 'application/use-cases/company.use-case';
import { BaseResponse } from '../responses/base.response';
import { JWTAuthGuard } from 'infrastructure/passport/guards/jwt-auth.guard';
import { GetCompanyDetailsResponse, GetCompanySearchResponse } from 'presentation/responses/admin-company.response';
import { CompanySearchRequest, CompanyStatusChangeRequest, CompanyDownloadRequest } from 'presentation/requests/admin-company.request';
import { Response } from 'express'
@ApiTags('Companies')
@Controller('companies')
@ApiProduces('application/json')
@ApiConsumes('application/json')
export class AdminCompanyController {
  constructor(@Inject(CompanyUseCase) private readonly companyUseCase: CompanyUseCase) {}
  @Get('/company/:id/details/')
  @UseGuards(JWTAuthGuard)
  @ApiOperation({
    summary: 'Find company detail',
    description: 'This endpoint retrieves company details in the system.',
  })
  @ApiResponse({ status: HttpStatus.OK, type: BaseResponse })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: BaseResponse })
  async getDetails(@Param('id') id): Promise<BaseResponse<GetCompanyDetailsResponse>> {
    return BaseResponse.of(new GetCompanyDetailsResponse(await this.companyUseCase.getDetails(parseInt(id))));
  }

  @Post('/company/:id/status/change')
  @UseGuards(JWTAuthGuard)
  @ApiOperation({
    summary: 'Change company status',
    description: 'This endpoint chaneg company status in the system.',
  })
  @ApiResponse({ status: HttpStatus.OK, type: BaseResponse })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: BaseResponse })
  async changeStatus(@Param('id') id, @Body() body: CompanyStatusChangeRequest): Promise<void> {
    await this.companyUseCase.changeStatus(parseInt(id), body.status);
  }

  @Get()
  @UseGuards(JWTAuthGuard)
  @ApiOperation({
    summary: 'Find companies list',
    description: 'This endpoint retrieves comapnies list in the system.',
  })
  @ApiResponse({ status: HttpStatus.OK, type: BaseResponse })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: BaseResponse })
  async getCompanies(@Query() request: CompanySearchRequest): Promise<BaseResponse<GetCompanySearchResponse>> {
    return BaseResponse.of(new GetCompanySearchResponse(await this.companyUseCase.getCompanies(request)));
  }

  @Get('/download')
  @UseGuards(JWTAuthGuard)
  @ApiOperation({
    summary: 'Find companies list',
    description: 'This endpoint retrieves comapnies list in the system.',
  })
  @ApiResponse({ status: HttpStatus.OK, type: BaseResponse })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: BaseResponse })
  async download(@Body() request: CompanyDownloadRequest, @Res() response: Response): Promise<void> {
    await this.companyUseCase.download(request,response);
  }
}
