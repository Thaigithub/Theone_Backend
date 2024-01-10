import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { AccountIdExtensionRequest } from 'utils/generics/base.request';
import { BaseResponse } from 'utils/generics/base.response';
import { CareerMemberService } from './career-member.service';
import { CareerMemberGetListCertificationRequest } from './request/career-member-get-list-certification.request';
import { CareerMemberGetListGeneralRequest } from './request/career-member-get-list-general.request';
import { CareerMemberUpsertGeneralRequest } from './request/career-member-upsert-general.request';
import { CareerMemberGetDetailGeneralResponse } from './response/career-member-get-detail-general.response';
import { CareerMemberGetListGeneralResponse } from './response/career-member-get-list-general.response';

@Controller('member/careers')
@UseGuards(AuthJwtGuard, AuthRoleGuard)
@Roles(AccountType.MEMBER)
export class CareerMemberController {
    constructor(private readonly careerMemberService: CareerMemberService) {}

    @Get('/general')
    async getListGeneral(
        @Query() query: CareerMemberGetListGeneralRequest,
        @Req() request: AccountIdExtensionRequest,
    ): Promise<BaseResponse<CareerMemberGetListGeneralResponse>> {
        return BaseResponse.of(await this.careerMemberService.getListGeneral(query, request.user.accountId));
    }

    @Post('/general')
    async createGeneral(
        @Body() body: CareerMemberUpsertGeneralRequest,
        @Req() request: AccountIdExtensionRequest,
    ): Promise<BaseResponse<void>> {
        body.startDate = new Date(body.startDate).toISOString();
        body.endDate = new Date(body.endDate).toISOString();
        return BaseResponse.of(await this.careerMemberService.createGeneral(body, request.user.accountId));
    }

    @Delete('/general/:id')
    async deleteGeneral(
        @Param('id', ParseIntPipe) id: number,
        @Req() request: AccountIdExtensionRequest,
    ): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.careerMemberService.deleteGeneral(id, request.user.accountId));
    }

    @Get('/general/:id')
    async getDetailGeneral(
        @Param('id', ParseIntPipe) id: number,
        @Req() request: AccountIdExtensionRequest,
    ): Promise<BaseResponse<CareerMemberGetDetailGeneralResponse>> {
        return BaseResponse.of(await this.careerMemberService.getDetailGeneral(id, request.user.accountId));
    }

    @Put('/general/:id')
    async updateGeneral(
        @Param('id', ParseIntPipe) id: number,
        @Req() request: AccountIdExtensionRequest,
        @Body() body: CareerMemberUpsertGeneralRequest,
    ): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.careerMemberService.updateGeneral(id, request.user.accountId, body));
    }

    @Get('/certification')
    async getListCertification(
        @Req() request: AccountIdExtensionRequest,
        @Query() query: CareerMemberGetListCertificationRequest,
    ) {
        return BaseResponse.of(await this.careerMemberService.getListCertification(request.user.accountId, query));
    }

    @Post('/certification/request')
    async createCertificationRequest(@Req() request: AccountIdExtensionRequest): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.careerMemberService.createCertificationRequest(request.user.accountId));
    }

    @Post('/certification/health-insurance')
    async getCertificationExperienceHealthInsurance(@Req() request: AccountIdExtensionRequest): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.careerMemberService.getCertExperienceByHealthInsurance(request.user.accountId));
    }

    @Post('/certification/employment-insurance')
    async getCertificationExperienceEmploymentInsurance(@Req() request: AccountIdExtensionRequest): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.careerMemberService.getCertExperienceByEmploymentInsurance(request.user.accountId));
    }

    @Post('/certification/the-one-site')
    async getCertificationExperienceTheOneSite(@Req() request: AccountIdExtensionRequest): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.careerMemberService.getCertExperienceByTheOneSite(request.user.accountId));
    }
}
