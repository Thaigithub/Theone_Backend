import { Body, Query, Param, Controller, Get, HttpStatus, Inject, Patch, UseGuards } from '@nestjs/common';
import { ApiConsumes, ApiOperation, ApiProduces, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CompanyUseCase } from 'application/use-cases/company.use-case';
import { BaseResponse } from '../responses/base.response';
import { JWTAuthGuard } from 'infrastructure/passport/guards/jwt-auth.guard';
import { CompanyDetailsResponse } from 'presentation/responses/admin-company.response';
import { CompanySearchRequest, CompanyStatusChangeRequest } from 'presentation/requests/admin-company.request';
import { PaginationResponse } from 'presentation/responses/pageInfo.response';
import { CompanyResponse } from 'presentation/responses/company.response';

@ApiTags('Admin Companies')
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
  async getDetails(@Param('id') id): Promise<BaseResponse<CompanyDetailsResponse>> {
    return BaseResponse.of(new CompanyDetailsResponse(await this.companyUseCase.getDetails(parseInt(id))));
  }

  @Patch('/:id/status')
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
  async getCompanies(@Query() request: CompanySearchRequest): Promise<BaseResponse<PaginationResponse<CompanyResponse>>> {
    return BaseResponse.of(PaginationResponse.of(await this.companyUseCase.getCompanies(request)));
  }
}
