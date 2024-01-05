import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query, Req, UseGuards } from '@nestjs/common';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { AccountIdExtensionRequest } from 'utils/generics/base.request';
import { BaseResponse } from 'utils/generics/base.response';
import { CareerMemberService } from './career-member.service';
import { CareerMemberGetListRequest } from './request/career-member-get-list.request';
import { CareerMemberUpsertRequest } from './request/career-member-upsert.request';
import { CareerMemberGetListResponse } from './response/career-member-get-list.response';

@Controller('member/careers')
@UseGuards(AuthJwtGuard, AuthRoleGuard)
@Roles(AccountType.MEMBER)
export class CareerMemberController {
    constructor(private readonly careerMemberService: CareerMemberService) {}

    // Get list of careers
    @Get()
    async getList(
        @Query() query: CareerMemberGetListRequest,
        @Req() request: AccountIdExtensionRequest,
    ): Promise<BaseResponse<CareerMemberGetListResponse>> {
        return BaseResponse.of(await this.careerMemberService.getList(query, request.user.accountId));
    }

    // Create new career
    @Post()
    async createCareer(
        @Body() body: CareerMemberUpsertRequest,
        @Req() request: AccountIdExtensionRequest,
    ): Promise<BaseResponse<void>> {
        body.startDate = new Date(body.startDate).toISOString();
        body.endDate = new Date(body.endDate).toISOString();
        return BaseResponse.of(await this.careerMemberService.createCareer(body, request.user.accountId));
    }

    // Delete a career
    @Delete(':id')
    async deleteCareer(
        @Param('id', ParseIntPipe) id: number,
        @Req() request: AccountIdExtensionRequest,
    ): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.careerMemberService.deleteCareer(id, request.user.accountId));
    }

    @Post('/apply-certificate')
    async applyCertificate(@Req() request: AccountIdExtensionRequest): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.careerMemberService.applyCertificate(request.user.accountId));
    }

    @Post('/certification-experience/health-insurance')
    async getCertificationExperienceHealthInsurance(@Req() request: AccountIdExtensionRequest): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.careerMemberService.getCertExperienceByHealthInsurance(request.user.accountId));
    }

    @Post('/certification-experience/employment-insurance')
    async getCertificationExperienceEmploymentInsurance(@Req() request: AccountIdExtensionRequest): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.careerMemberService.getCertExperienceByEmploymentInsurance(request.user.accountId));
    }

    @Post('/certification-experience/the-one-site')
    async getCertificationExperienceTheOneSite(@Req() request: AccountIdExtensionRequest): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.careerMemberService.getCertExperienceByTheOneSite(request.user.accountId));
    }
}
