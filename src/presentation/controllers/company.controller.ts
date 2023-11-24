import { Body, Controller, Get, HttpStatus, Inject, Post, UseGuards, Request } from '@nestjs/common';
import { ApiConsumes, ApiOperation, ApiProduces, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CompanyUseCase } from 'application/use-cases/company.use-case';
import { BaseResponse } from '../responses/base.response';
import { JWTAuthGuard } from 'infrastructure/passport/guards/jwt-auth.guard';
import { GetCompanyDetailsResponse } from 'presentation/responses/company.response';
import { Roles, RolesGuard } from 'infrastructure/passport/guards/roles.guard';

@ApiTags('Companies')
@Controller('companies')
@ApiProduces('application/json')
@ApiConsumes('application/json')
export class CompanyController {
    constructor(@Inject (CompanyUseCase) private readonly companyUseCase: CompanyUseCase) {}
    @Get('/company/details')
    // @Roles(UserType.CUSTOMER)
    // @UseGuards(JWTAuthGuard, RolesGuard)
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
}