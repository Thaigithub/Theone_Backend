import { Controller, Get, HttpStatus, Param, ParseArrayPipe, ParseIntPipe, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiProduces, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { AccountIdExtensionRequest } from 'utils/generics/base.request';
import { BaseResponse } from 'utils/generics/base.response';
import { PageInfo, PaginationResponse } from 'utils/generics/pagination.response';
import { MemberCompanyService } from './member-company.service';
import { MemberCompanyManpowerGetListRequest } from './request/member-company-manpower-get-list.request';
import { MemberCompanyCountWorkersResponse } from './response/member-company-get-count-worker.response';
import { MemberCompanyManpowerGetDetailResponse } from './response/member-company-manpower-get-detail.response';
import { MemberCompanyManpowerGetListResponse } from './response/member-company-manpower-get-list.response';

@ApiTags('[COMPANY] Member Management')
@Controller('/company/members')
@Roles(AccountType.COMPANY)
@UseGuards(AuthJwtGuard, AuthRoleGuard)
@ApiBearerAuth()
@ApiProduces('application/json')
@ApiConsumes('application/json')
export class MemberCompanyController {
    constructor(private memberCompanyService: MemberCompanyService) {}

    @Get('/count-working-members')
    @ApiOperation({
        summary: 'Count all worker that are working (having that contract is active, use for dashboard)',
        description: 'Company retrieve the total number of workers that are working (having that contract is active',
    })
    @ApiResponse({ status: HttpStatus.ACCEPTED, type: MemberCompanyCountWorkersResponse })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'The company account does not exist', type: BaseResponse })
    async countPosts(@Req() req: AccountIdExtensionRequest): Promise<BaseResponse<MemberCompanyCountWorkersResponse>> {
        return BaseResponse.of(await this.memberCompanyService.countWorkers(req.user.accountId));
    }

    @Get(':id/manpower')
    @ApiOperation({
        summary: 'Get member detail in Manpower',
        description: 'Company can retrieve member information detail in Manpower',
    })
    @ApiResponse({ status: HttpStatus.OK, type: MemberCompanyManpowerGetDetailResponse })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: BaseResponse })
    async getMemberDetailManpower(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<BaseResponse<MemberCompanyManpowerGetDetailResponse>> {
        return BaseResponse.of(await this.memberCompanyService.getMemberDetailManpower(id));
    }

    @Get('manpower')
    @ApiOperation({
        summary: 'Get list of members in Manpower',
        description: 'Company can retrieve all members in Manpower',
    })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: BaseResponse })
    async getListMember(
        @Query() query: MemberCompanyManpowerGetListRequest,
        @Query('occupation', new ParseArrayPipe({ optional: true })) occupation: [string] | undefined,
        @Query('experienceTypeList', new ParseArrayPipe({ optional: true })) experienceTypeList: [string] | undefined,
        @Query('regionList', new ParseArrayPipe({ optional: true })) regionList: [string] | undefined,
    ): Promise<BaseResponse<MemberCompanyManpowerGetListResponse>> {
        query = { ...query, experienceTypeList, occupation, regionList };
        const list = await this.memberCompanyService.getList(query);
        const total = await this.memberCompanyService.getTotal(query);
        const paginationResponse = new PaginationResponse(list, new PageInfo(total));
        return BaseResponse.of(paginationResponse);
    }
}
