import { Controller, Get, HttpStatus, Query } from '@nestjs/common';
import { ApiConsumes, ApiOperation, ApiProduces, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BaseResponse } from 'utils/generics/base.response';
import { PageInfo, PaginationResponse } from 'utils/generics/pagination.response';
import { PostUserService } from './post-user.service';
import { PostUserGetListRequest } from './request/post-user-get-list.request';
import { PostUserGetListResponse } from './response/post-user-get-list.response';

@Controller('/user/posts')
@ApiTags('[NON-MEMBER] Post management')
@ApiProduces('application/json')
@ApiConsumes('application/json')
export class PostUserController {
    constructor(private readonly postUserService: PostUserService) {}

    @Get()
    @ApiOperation({
        summary: 'Get list of posts',
        description: 'Non-member can retrieve all posts based on PostType and keyword',
    })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: BaseResponse })
    async getGeneralPosts(@Query() query: PostUserGetListRequest): Promise<BaseResponse<PostUserGetListResponse>> {
        const list = await this.postUserService.getList(undefined, query, undefined);
        const total = await this.postUserService.getTotal(query, undefined);
        const paginationResponse = new PaginationResponse(list, new PageInfo(total));
        return BaseResponse.of(paginationResponse);
    }
}
