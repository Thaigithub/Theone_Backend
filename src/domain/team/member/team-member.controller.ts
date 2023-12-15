import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Inject,
    Param,
    ParseIntPipe,
    Post,
    Put,
    Req,
    Request,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiProduces, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { BaseResponse } from 'utils/generics/base.response';
import { GetTeamDetailsResponse } from '../admin/response/admin-team.response';
import { MemberCreateTeamRequest, MemberUpdateTeamRequest } from './request/member-upsert-team.request';
import { TeamMemberApplyPost } from './request/team-member-apply-post.request';
import { MemberTeamsResponse } from './response/member-teams.response';
import { MemberTeamService } from './team-member.service';

@ApiTags('[Member] Team Management')
@Controller('member/teams')
@UseGuards(AuthJwtGuard, AuthRoleGuard)
@Roles(AccountType.MEMBER)
@ApiBearerAuth()
@ApiProduces('application/json')
@ApiConsumes('application/json')
export class MemberTeamController {
    constructor(@Inject(MemberTeamService) private readonly memberTeamService: MemberTeamService) {}

    @Post('save')
    @Roles(AccountType.MEMBER)
    @UseGuards(AuthJwtGuard, AuthRoleGuard)
    @HttpCode(200)
    @ApiOperation({
        summary: 'Create new team',
        description: 'This endpoint allow user to create new team',
    })
    @ApiResponse({ status: HttpStatus.OK, description: 'Create team successfully' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Create team details failed' })
    async save(@Request() req, @Body() request: MemberCreateTeamRequest): Promise<BaseResponse<void>> {
        await this.memberTeamService.saveTeam(req.user.accountId, request);
        return BaseResponse.ok();
    }

    @Get()
    @Roles(AccountType.MEMBER)
    @UseGuards(AuthJwtGuard, AuthRoleGuard)
    @ApiOperation({
        summary: 'Get list of teams',
        description: 'This endpoint list of teams of a member',
    })
    @ApiResponse({ status: HttpStatus.OK, description: 'Result of teams' })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Search failed' })
    async getListOfTeams(@Request() req): Promise<BaseResponse<MemberTeamsResponse[]>> {
        return BaseResponse.of(await this.memberTeamService.getTeams(req.user.accountId));
    }

    @Get(':id')
    @Roles(AccountType.MEMBER)
    @UseGuards(AuthJwtGuard, AuthRoleGuard)
    @ApiOperation({
        summary: 'Get team details',
        description: 'This endpoint get all information about team',
    })
    @ApiResponse({ status: HttpStatus.OK, description: 'Result of teams' })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Search failed' })
    async getTeamDetails(@Param('id', ParseIntPipe) id: number): Promise<BaseResponse<GetTeamDetailsResponse>> {
        return BaseResponse.of(await this.memberTeamService.getTeamDetails(id));
    }

    @Put('update')
    @Roles(AccountType.MEMBER)
    @UseGuards(AuthJwtGuard, AuthRoleGuard)
    @ApiOperation({
        summary: 'Update team',
        description: 'This endpoint update team information',
    })
    @ApiResponse({ status: HttpStatus.OK, description: 'update successfully' })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'update failed' })
    async updateTeam(@Request() req, @Body() request: MemberUpdateTeamRequest): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.memberTeamService.update(req.user.accountId, request));
    }

    @Post('apply-post')
    @ApiOperation({
        summary: 'Apply a post',
        description: "This endpoint add a post to request's team apply list in the system.",
    })
    @ApiResponse({ status: HttpStatus.OK, type: BaseResponse })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: BaseResponse })
    async addApplyPost(@Req() request: any, @Body() payload: TeamMemberApplyPost): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.memberTeamService.addApplyPost(request.user.accountId, payload));
    }
}
