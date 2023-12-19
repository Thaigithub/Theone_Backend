import { Controller, Get, HttpStatus, Param, ParseIntPipe, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiProduces, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { BaseResponse } from 'utils/generics/base.response';
import { PostMemberService } from './post-member.service';
import { PostMemberUpdateInterestResponse } from './response/post-member-update-interest.response';
import { PostMemberGetListResponse, PostResponse } from './response/post-member-get-list.response';
import { PostMemberGetListRequest } from './request/post-member-get-list.request';
import { PageInfo, PaginationResponse } from 'utils/generics/pageInfo.response';
import { ApiOkResponsePaginated } from 'utils/generics/pagination.decorator.reponse';

@ApiTags('[MEMBER] Posts Management')
@Controller('/member/posts')
@Roles(AccountType.MEMBER)
@UseGuards(AuthJwtGuard, AuthRoleGuard)
@ApiBearerAuth()
@ApiProduces('application/json')
@ApiConsumes('application/json')
export class PostMemberController {
    constructor(private postMemberService: PostMemberService) {}

    @Get()
    @ApiOperation({
        summary: 'Get list of posts',
        description: 'Member can retrieve all posts',
    })
    @ApiOkResponsePaginated(PostResponse)
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: BaseResponse })
    async getList(@Query() query: PostMemberGetListRequest): Promise<BaseResponse<PostMemberGetListResponse>> {
        const list = await this.postMemberService.getList(query);
        const total = await this.postMemberService.getTotal();
        const paginationResponse = new PaginationResponse(list, new PageInfo(total));
        return BaseResponse.of(paginationResponse);
    }

    @Post('/:id/apply')
    @ApiOperation({
        summary: 'Apply a post',
        description: "This endpoint add a post to request's member apply list in the system.",
    })
    @ApiResponse({ status: HttpStatus.OK, type: BaseResponse })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: BaseResponse })
    async addApplyPost(@Req() request: any, @Param('id', ParseIntPipe) id: number): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.postMemberService.addApplyPost(request.user.accountId, id));
    }

    @Post('/:id/interest')
    @ApiOperation({
        summary: 'Add interest post',
        description: "This endpoint add a post to request's member interest list in the system.",
    })
    @ApiResponse({ status: HttpStatus.OK, type: PostMemberUpdateInterestResponse })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: BaseResponse })
    async addInterestPost(
        @Req() request: any,
        @Param('id', ParseIntPipe) id: number,
    ): Promise<BaseResponse<PostMemberUpdateInterestResponse>> {
        return BaseResponse.of(await this.postMemberService.updateInterestPost(request.user.accountId, id));
    }
}
