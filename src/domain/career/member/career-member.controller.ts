import { Body, Controller, Delete, Get, HttpStatus, Param, ParseIntPipe, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { BaseResponse } from 'utils/generics/base.response';
import { PageInfo, PaginationResponse } from 'utils/generics/pageInfo.response';
import { AccountIdExtensionRequest } from 'utils/generics/upsert-account.request';
import { CareerMemberService } from './career-member.service';
import { CareerMemberCreateRequest } from './request/career-member-create.request';
import { CareerMemberGetListRequest } from './request/career-member-get-list-request';
import { CareerMemberGetListResponse } from './response/career-member-get-list.response';

@UseGuards(AuthJwtGuard, AuthRoleGuard)
@Roles(AccountType.MEMBER)
@ApiBearerAuth()
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
        type: CareerMemberGetListResponse,
        description: 'Get list career successfully',
        status: HttpStatus.OK,
    })
    async getList(
        @Query() query: CareerMemberGetListRequest,
        @Req() request: AccountIdExtensionRequest,
    ): Promise<BaseResponse<CareerMemberGetListResponse>> {
        const list = await this.careerMemberService.getList(query, request.user.accountId);
        const total = await this.careerMemberService.getTotal(query, request.user.accountId);
        const paginationReponse = new PaginationResponse(list, new PageInfo(total));
        return BaseResponse.of(paginationReponse);
    }

    // Create new career
    @Post()
    @ApiOperation({
        summary: 'Create career',
        description: 'Members can register a new GENERAL career',
    })
    @ApiResponse({
        type: BaseResponse,
        description: 'Create career successfully',
        status: HttpStatus.OK,
    })
    async createCareer(
        @Body() body: CareerMemberCreateRequest,
        @Req() request: AccountIdExtensionRequest,
    ): Promise<BaseResponse<null>> {
        body.startDate = new Date(body.startDate).toISOString();
        body.endDate = new Date(body.endDate).toISOString();
        await this.careerMemberService.createCareer(body, request.user.accountId);
        return BaseResponse.ok();
    }

    // Delete a career
    @Delete(':id')
    @ApiOperation({
        summary: 'Delete career',
        description: 'Members can delete a registered career',
    })
    @ApiResponse({
        type: BaseResponse,
        description: 'Delete career successfully',
        status: HttpStatus.OK,
    })
    @ApiResponse({
        description: 'Career does not exist',
        status: HttpStatus.NOT_FOUND,
    })
    async deleteCareer(
        @Param('id', ParseIntPipe) id: number,
        @Req() request: AccountIdExtensionRequest,
    ): Promise<BaseResponse<null>> {
        await this.careerMemberService.deleteCareer(id, request.user.accountId);
        return BaseResponse.ok();
    }
}
