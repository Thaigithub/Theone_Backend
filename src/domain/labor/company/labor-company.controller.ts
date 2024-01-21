import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { BaseRequest } from 'utils/generics/base.request';
import { BaseResponse } from 'utils/generics/base.response';
import { LaborCompanyService } from './labor-company.service';
import { LaborCompanyCreateRequest } from './request/labor-company-create.request';
import { LaborCompanyGetListRequest } from './request/labor-company-get-list.request';
import { LaborCompanyCreateSalaryRequest } from './request/labor-company-salary-create.request';
import { LaborCompanyUpsertWorkDateRequest } from './request/labor-company-upsert-workdate.request';
import { LaborCompanyGetDetailSalaryResponse } from './response/labor-company-get-detail-salary.response';
import { LaborCompanyGetDetailResponse } from './response/labor-company-get-detail.response';
import { LaborCompanyGetListWorkDateResponse } from './response/labor-company-get-list-workdates.response';
import { LaborCompanyGetListResponse } from './response/labor-company-get-list.response';

@Controller('/company/labors')
@Roles(AccountType.COMPANY)
@UseGuards(AuthJwtGuard, AuthRoleGuard)
export class LaborCompanyController {
    constructor(private laborCompanyService: LaborCompanyService) {}
    @Get('/:id/salary/:salaryId')
    async getDetailSalary(
        @Param('id', ParseIntPipe) laborId: number,
        @Param('salaryId', ParseIntPipe) salaryId: number,
        @Req() req: BaseRequest,
    ): Promise<BaseResponse<LaborCompanyGetDetailSalaryResponse>> {
        return BaseResponse.of(await this.laborCompanyService.getDetailSalary(req.user.accountId, laborId, salaryId));
    }

    @Post('/:id/salary')
    async createSalary(
        @Param('id', ParseIntPipe) id: number,
        @Req() req: BaseRequest,
        @Body() body: LaborCompanyCreateSalaryRequest,
    ): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.laborCompanyService.createSalary(req.user.accountId, id, body));
    }

    @Get('/:id/workDate')
    async getWorkDates(
        @Param('id', ParseIntPipe) id: number,
        @Req() req: BaseRequest,
    ): Promise<BaseResponse<LaborCompanyGetListWorkDateResponse>> {
        return BaseResponse.of(await this.laborCompanyService.getWorkDates(req.user.accountId, id));
    }

    @Put('/:id/workDate')
    async update(
        @Req() req: BaseRequest,
        @Param('id', ParseIntPipe) id: number,
        @Body() body: LaborCompanyUpsertWorkDateRequest,
    ): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.laborCompanyService.updateWorkDate(req.user.accountId, id, body));
    }

    @Get('/:id')
    async getDetail(
        @Param('id', ParseIntPipe) id: number,
        @Req() req: BaseRequest,
    ): Promise<BaseResponse<LaborCompanyGetDetailResponse>> {
        return BaseResponse.of(await this.laborCompanyService.getDetail(req.user.accountId, id));
    }

    @Get()
    async getList(
        @Req() req: BaseRequest,
        @Query() query: LaborCompanyGetListRequest,
    ): Promise<BaseResponse<LaborCompanyGetListResponse>> {
        return BaseResponse.of(await this.laborCompanyService.getList(req.user.accountId, query));
    }

    @Post()
    async create(@Req() req: BaseRequest, @Body() body: LaborCompanyCreateRequest): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.laborCompanyService.create(req.user.accountId, body));
    }
}
