import { Body, Query, Param, Controller, Get, HttpStatus, Inject, Patch, UseGuards, Res, ParseIntPipe } from '@nestjs/common';
import { ApiConsumes, ApiOperation, ApiProduces, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CompanyUseCase } from 'application/use-cases/company.use-case';
import { BaseResponse } from '../../responses/base.response';
import { JWTAuthGuard } from 'infrastructure/passport/guards/jwt-auth.guard';
import { CompanyDetailsResponse, CompanyResponse } from 'presentation/responses/company.response';
import { CompanySearchRequest, CompanyStatusChangeRequest, CompanyDownloadRequest } from 'presentation/requests/admin-company.request';
import { Response } from 'express';
import { PaginationResponse } from 'presentation/responses/pageInfo.response';
@ApiTags('[ADMIN] Company management')
@Controller('/admin/companies')
@ApiProduces('application/json')
@ApiConsumes('application/json')
export class AdminCompanyController {
  constructor(@Inject(CompanyUseCase) private readonly companyUseCase: CompanyUseCase) {}
  @Get('/:id/details/')
  @UseGuards(JWTAuthGuard)
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
  @UseGuards(JWTAuthGuard)
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
  @UseGuards(JWTAuthGuard)
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
  @UseGuards(JWTAuthGuard)
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
