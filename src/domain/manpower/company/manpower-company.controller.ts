import {
    BadRequestException,
    Body,
    Controller,
    Get,
    HttpStatus,
    Param,
    ParseArrayPipe,
    ParseIntPipe,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiProduces, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AccountType, ExperienceType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { BaseResponse } from 'utils/generics/base.response';
import { ManpowerCompanyService } from './manpower-company.service';
import { ManpowerCompanyGetListMembersRequest } from './request/manpower-company-get-list-members.request';
import { ManpowerCompanyGetListTeamsRequest } from './request/manpower-company-get-list-teams.request';
import { ManpowerCompanyProposeInterviewRequest } from './request/manpower-company-propose-interview.request';
import {
    ManpowerCompanyGetListMembersResponse,
    ManpowerListMembersResponse,
} from './response/manpower-company-get-list-members.response';
import { ManpowerCompanyGetListTeamsResponse } from './response/manpower-company-get-list-teams.response';
import { ManpowerCompanyGetMemberDetailResponse } from './response/manpower-company-get-member-detail.response';
import { ManpowerCompanyGetTeamDetailResponse } from './response/manpower-company-get-team-detail.response';
import { ApiOkResponsePaginated } from 'utils/generics/pagination.decorator';
import { PageInfo, PaginationResponse } from 'utils/generics/pagination.response';

@Controller('/company/manpower')
@ApiTags('[COMPANY] Manpower management')
@Roles(AccountType.COMPANY)
@UseGuards(AuthJwtGuard, AuthRoleGuard)
@ApiBearerAuth()
@ApiProduces('application/json')
@ApiConsumes('application/json')
export class ManpowerCompanyController {
    constructor(private readonly manpowerCompanyService: ManpowerCompanyService) {}

    private parseQuery(
        query: ManpowerCompanyGetListMembersRequest | ManpowerCompanyGetListTeamsRequest,
        occupationList: [string],
        experienceTypeList: [string],
        regionList: [string],
    ): void {
        // Check validation
        const parsedOccupationList = occupationList?.map((item) => {
            const parsedItem = parseInt(item);
            if (isNaN(parsedItem)) throw new BadRequestException('Occupation list item must be in type number');
            return parsedItem;
        });
        const parsedExperienceTypeList = experienceTypeList?.map((item) => {
            const parsedItem = ExperienceType[item];
            if (parsedItem === undefined)
                throw new BadRequestException(
                    'ExperienceType list item must be in following values: SHORT, MEDIUM, LONG, REGARDLESS',
                );
            return parsedItem;
        });
        query.occupationList = parsedOccupationList;
        query.experienceTypeList = parsedExperienceTypeList;
        query.regionList = regionList;
    }

    @Get('members')
    @ApiOperation({
        summary: 'Get list of members',
        description: 'Company can retrieve all members',
    })
    @ApiOkResponsePaginated(ManpowerListMembersResponse)
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: BaseResponse })
    async getListMember(
        @Query() query: ManpowerCompanyGetListMembersRequest,
        @Query('occupationList', new ParseArrayPipe({ optional: true })) occupationList: [string] | undefined,
        @Query('experienceTypeList', new ParseArrayPipe({ optional: true })) experienceTypeList: [string] | undefined,
        @Query('regionList', new ParseArrayPipe({ optional: true })) regionList: [string] | undefined,
    ): Promise<BaseResponse<ManpowerCompanyGetListMembersResponse>> {
        this.parseQuery(query, occupationList, experienceTypeList, regionList);
        const list = await this.manpowerCompanyService.getListMembers(query);
        const total = await this.manpowerCompanyService.getTotalMembers(query);
        const paginationResponse = new PaginationResponse(list, new PageInfo(total));
        return BaseResponse.of(paginationResponse);
    }

    @Get('teams')
    @ApiOperation({
        summary: 'Get list of teams',
        description: 'Company can retrieve all teams',
    })
    @ApiOkResponsePaginated(ManpowerListMembersResponse)
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: BaseResponse })
    async getListTeams(
        @Query() query: ManpowerCompanyGetListTeamsRequest,
        @Query('occupationList', new ParseArrayPipe({ optional: true })) occupationList: [string] | undefined,
        @Query('experienceTypeList', new ParseArrayPipe({ optional: true })) experienceTypeList: [string] | undefined,
        @Query('regionList', new ParseArrayPipe({ optional: true })) regionList: [string] | undefined,
    ): Promise<BaseResponse<ManpowerCompanyGetListTeamsResponse>> {
        this.parseQuery(query, occupationList, experienceTypeList, regionList);
        const list = await this.manpowerCompanyService.getListTeams(query);
        const total = await this.manpowerCompanyService.getTotalTeams(query);
        const paginationResponse = new PaginationResponse(list, new PageInfo(total));
        return BaseResponse.of(paginationResponse);
    }

    @Get('members/:id')
    @ApiOperation({
        summary: 'Get member detail',
        description: 'Company can retrieve member information detail',
    })
    @ApiResponse({ status: HttpStatus.OK, type: ManpowerCompanyGetMemberDetailResponse })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: BaseResponse })
    async getMemberDetail(@Param('id', ParseIntPipe) id: number): Promise<BaseResponse<ManpowerCompanyGetMemberDetailResponse>> {
        return BaseResponse.of(await this.manpowerCompanyService.getMemberDetail(id));
    }

    @Get('teams/:id')
    @ApiOperation({
        summary: 'Get team detail',
        description: 'Company can retrieve team information detail',
    })
    @ApiResponse({ status: HttpStatus.OK, type: ManpowerCompanyGetTeamDetailResponse })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: BaseResponse })
    async getTeamDetail(@Param('id', ParseIntPipe) id: number): Promise<BaseResponse<ManpowerCompanyGetTeamDetailResponse>> {
        return BaseResponse.of(await this.manpowerCompanyService.getTeamDetail(id));
    }

    @Post('interview')
    @ApiOperation({
        summary: 'Propose member or team interview',
        description: 'Company can create an interview proposal for member or team',
    })
    @ApiResponse({ status: HttpStatus.OK, type: BaseResponse })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: BaseResponse })
    async proposeTeamInterview(@Body() body: ManpowerCompanyProposeInterviewRequest): Promise<BaseResponse<null>> {
        await this.manpowerCompanyService.proposeInterview(body);
        return BaseResponse.ok();
    }
}
