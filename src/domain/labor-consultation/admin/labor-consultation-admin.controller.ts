import { Body, Controller, Delete, Get, Param, ParseArrayPipe, ParseIntPipe, Patch, Query, UseGuards } from '@nestjs/common';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { BaseResponse } from 'utils/generics/base.response';
import { LaborConsultationAdminService } from './labor-consultation-admin.service';
import { LaborConsultationAdminAnswerRequest } from './request/labor-consultation-admin-answer.request';
import { LaborConsultationAdminGetListRequest } from './request/labor-consultation-admin-get-list.request';
import { LaborConsultationAdminGetDetailResponse } from './response/labor-consultation-admin-get-detail.response';
import { LaborConsultationAdminGetListResponse } from './response/labor-consultation-admin-get-list.response';

@Controller('/admin/labor-consultations')
@UseGuards(AuthJwtGuard, AuthRoleGuard)
@Roles(AccountType.ADMIN)
export class LaborConsultationAdminController {
    constructor(private laborConsultationService: LaborConsultationAdminService) {}

    @Get()
    async getList(
        @Query() query: LaborConsultationAdminGetListRequest,
    ): Promise<BaseResponse<LaborConsultationAdminGetListResponse>> {
        return BaseResponse.of(await this.laborConsultationService.getList(query));
    }

    @Delete()
    async delete(
        @Query('ids', new ParseArrayPipe({ items: Number, separator: ',' }))
        ids: number[],
    ): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.laborConsultationService.delete(ids));
    }

    @Get('/:id')
    async getDetail(@Param('id', ParseIntPipe) id: number): Promise<BaseResponse<LaborConsultationAdminGetDetailResponse>> {
        return BaseResponse.of(await this.laborConsultationService.getDetail(id));
    }

    @Patch('/:id/answer')
    async updateAnswer(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: LaborConsultationAdminAnswerRequest,
    ): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.laborConsultationService.updateAnswer(id, body));
    }
}
