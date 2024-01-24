import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, Req, UseGuards } from '@nestjs/common';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { BaseRequest } from 'utils/generics/base.request';
import { BaseResponse } from 'utils/generics/base.response';
import { LaborConsultationCompanyService } from './labor-consultation-company.service';
import { LaborConsultationCompanyCreateRequest } from './request/labor-consultation-company-create.request';
import { LaborConsultationCompanyGetListRequest } from './request/labor-consultation-company-get-list.request';
import { LaborConsultationCompanyGetDetailResponse } from './response/labor-consultation-company-get-detail.response';
import { LaborConsultationCompanyGetListResponse } from './response/labor-consultation-company-get-list-response';

@Controller('/company/labor-consultations')
@UseGuards(AuthJwtGuard, AuthRoleGuard)
@Roles(AccountType.COMPANY)
export class LaborConsultationCompanyController {
    constructor(private laborConsultationCompanyService: LaborConsultationCompanyService) {}

    @Get()
    async getList(
        @Query() query: LaborConsultationCompanyGetListRequest,
        @Req() req: BaseRequest,
    ): Promise<BaseResponse<LaborConsultationCompanyGetListResponse>> {
        return BaseResponse.of(await this.laborConsultationCompanyService.getList(req.user.accountId, query));
    }

    @Post()
    async create(@Body() body: LaborConsultationCompanyCreateRequest, @Req() req: BaseRequest): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.laborConsultationCompanyService.create(req.user.accountId, body));
    }

    @Get('/:id')
    async getDetail(
        @Param('id', ParseIntPipe) id: number,
        @Req() req: BaseRequest,
    ): Promise<BaseResponse<LaborConsultationCompanyGetDetailResponse>> {
        return BaseResponse.of(await this.laborConsultationCompanyService.getDetail(req.user.accountId, id));
    }
}
