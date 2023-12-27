import { Controller, Get, HttpStatus, Param, ParseArrayPipe, ParseIntPipe, Patch, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiProduces, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AccountType, PostApplicationStatus } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { BaseResponse } from 'utils/generics/base.response';
import { ApplicationMemberService } from './application-member.service';
import { ChangeApplicationStatus } from './enum/application-member-change-status.enum';
import { ApplicationMemberGetListOfferRequest } from './request/application-member-get-list-offer.request';
import { ApplicationMemberGetListRequest } from './request/application-member-get-list.request';
import { ApplicationMemberGetDetailResponse } from './response/application-member-get-detail.response';
import { ApplicationMemberGetListOfferResponse } from './response/application-member-get-list-offer.response';
import { ApplicationMemberGetListResponse } from './response/application-member-get-list.response';

@ApiTags('[MEMBER] Application Management')
@Controller('/member/applications')
@Roles(AccountType.MEMBER)
@UseGuards(AuthJwtGuard, AuthRoleGuard)
@ApiProduces('application/json')
@ApiConsumes('application/json')
@ApiBearerAuth()
export class ApplicationMemberController {
    constructor(private applicationMemberService: ApplicationMemberService) {}

    @Patch('/:id/accept')
    @ApiOperation({
        summary: 'Accept offer',
        description: 'Member can accept offer',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        type: BaseResponse,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        type: BaseResponse,
    })
    async acceptApplicationStatus(@Param('id', ParseIntPipe) id: number, @Req() request: any): Promise<BaseResponse<void>> {
        return BaseResponse.of(
            await this.applicationMemberService.changeApplicationStatus(
                id,
                request.user.accountId,
                ChangeApplicationStatus.ACCEPT,
            ),
        );
    }
    @Patch('/:id/reject')
    @ApiOperation({
        summary: 'Reject offer',
        description: 'Member can reject offer',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        type: BaseResponse,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        type: BaseResponse,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        type: BaseResponse,
    })
    async rejectApplicationStatus(@Param('id', ParseIntPipe) id: number, @Req() request: any): Promise<BaseResponse<void>> {
        return BaseResponse.of(
            await this.applicationMemberService.changeApplicationStatus(
                id,
                request.user.accountId,
                ChangeApplicationStatus.REJECT,
            ),
        );
    }
    @Get('/offer')
    @ApiOperation({
        summary: 'Reject offer',
        description: 'Member can reject offer',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        type: BaseResponse,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        type: BaseResponse,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        type: BaseResponse,
    })
    async getApplicationOfferList(
        @Query() body: ApplicationMemberGetListOfferRequest,
        @Req() request: any,
    ): Promise<BaseResponse<ApplicationMemberGetListOfferResponse>> {
        return BaseResponse.of(await this.applicationMemberService.getApplicationOfferList(request.user.accountId, body));
    }

    @Get('/:id')
    @ApiOperation({
        summary: 'Listing post applied',
        description: 'Member can search/filter post applied',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        type: ApplicationMemberGetDetailResponse,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        type: BaseResponse,
    })
    async getDetailApplication(
        @Param('id', ParseIntPipe) id: number,
        @Req() req: any,
    ): Promise<BaseResponse<ApplicationMemberGetDetailResponse>> {
        return BaseResponse.of(await this.applicationMemberService.getDetailApplication(id, req.user.accountId));
    }
    @Get()
    @ApiOperation({
        summary: 'Listing post applied',
        description: 'Member can search/filter post applied',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        type: ApplicationMemberGetListResponse,
    })
    async getApplicationList(
        @Req() request: any,
        @Query() query: ApplicationMemberGetListRequest,
        @Query('status', ParseArrayPipe) status: PostApplicationStatus[],
    ): Promise<BaseResponse<ApplicationMemberGetListResponse>> {
        return BaseResponse.of(await this.applicationMemberService.getApplicationList(request.user.accountId, query, status));
    }
}
