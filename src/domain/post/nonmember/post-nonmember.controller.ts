import { Controller, Get, HttpStatus, Query } from '@nestjs/common';
import { ApiConsumes, ApiOperation, ApiProduces, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BaseResponse } from 'utils/generics/base.response';
import { PageInfo, PaginationResponse } from 'utils/generics/pagination.response';
import { PostNonmemberService } from './post-nonmember.service';
import { PostNonmemberGetListRequest } from './request/post-nonmember-get-list.request';
import { PostNonmemberGetListResponse } from './response/post-nonmember-get-list.response';

@Controller('/non-member/posts')
@ApiTags('[NON-MEMBER] Post management')
@ApiProduces('application/json')
@ApiConsumes('application/json')
export class PostNonmemberController {
    constructor(private readonly postNonmemberService: PostNonmemberService) {}

    @Get()
    @ApiOperation({
        summary: 'Get list of posts',
        description: 'Non-member can retrieve all posts based on PostType and keyword',
    })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: BaseResponse })
    async getGeneralPosts(@Query() query: PostNonmemberGetListRequest): Promise<BaseResponse<PostNonmemberGetListResponse>> {
        const list = await this.postNonmemberService.getList(undefined, query, undefined);
        const total = await this.postNonmemberService.getTotal(query, undefined);
        const paginationResponse = new PaginationResponse(list, new PageInfo(total));
        return BaseResponse.of(paginationResponse);
    }
}
