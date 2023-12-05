import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { BaseResponse } from 'utils/generics/base.response';
import { CareerMemberService } from './career-member.service';
import { GetCareersListResponse } from './response/career-member.response';
import { CreateCareerRequest, GetCareersListRequest } from './request/career-member.request';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { AccountType } from '@prisma/client';

@UseGuards(AuthJwtGuard, AuthRoleGuard)
@Roles(AccountType.MEMBER)
@Controller('member/careers')
@ApiTags('[MEMBER] Career information')
export class CareerMemberController {
    constructor(private readonly careerMemberService: CareerMemberService) {}

    // Get list of careers
    @Get()
    @ApiOperation({
        summary: 'Get list of careers of a member',
        description: 'Members can retrieve all of their careers',
    })
    @ApiResponse({
        type: GetCareersListResponse,
    })
    async getList(@Query() query: GetCareersListRequest, @Req() request: any): Promise<BaseResponse<GetCareersListResponse>> {
        const careersList = await this.careerMemberService.getList(query, request);
        const careersTotal = await this.careerMemberService.getTotal(query, request);
        const getCareersListReponse = new GetCareersListResponse(careersList, careersTotal);
        return BaseResponse.of(getCareersListReponse);
    }

    // Create new career
    @Post()
    @ApiOperation({
        summary: 'Create career',
        description: 'Members can register a new GENERAL career',
    })
    async createCareer(@Body() body: CreateCareerRequest, @Req() request: any): Promise<BaseResponse<null>> {
        body.startDate = `${body.startDate}T00:00:00Z`;
        body.endDate = `${body.endDate}T00:00:00Z`;
        await this.careerMemberService.createCareer(body, request);
        return BaseResponse.ok();
    }

    // Delete a career
    @Delete(':id')
    @ApiOperation({
        summary: 'Delete career',
        description: 'Members can delete a registered career',
    })
    async deleteCareer(@Param('id', ParseIntPipe) id: number, @Req() request: any): Promise<BaseResponse<null>> {
        await this.careerMemberService.deleteCareer(id, request);
        return BaseResponse.ok();
    }
}
