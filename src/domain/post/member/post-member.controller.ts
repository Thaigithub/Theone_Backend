import {
    BadRequestException,
    Controller,
    Get,
    HttpStatus,
    Param,
    ParseArrayPipe,
    ParseIntPipe,
    Post,
    Query,
    Req,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiProduces, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AccountType, ExperienceType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { BaseResponse } from 'utils/generics/base.response';
import { PostMemberService } from './post-member.service';
import { PostMemberUpdateInterestResponse } from './response/post-member-update-interest.response';
import { PostMemberGetListResponse, PostResponse } from './response/post-member-get-list.response';
import { PageInfo, PaginationResponse } from 'utils/generics/pageInfo.response';
import { ApiOkResponsePaginated } from 'utils/generics/pagination.decorator.reponse';
import { PostMemberGetListRequest } from './request/post-member-get-list.request';
import { AccountIdExtensionRequest } from 'utils/generics/upsert-account.request';
import { PostMemberGetDetailResponse } from './response/post-member-get-detail.response';

@Controller('/member/posts')
@ApiTags('[MEMBER] Post management')
@Roles(AccountType.MEMBER)
@UseGuards(AuthJwtGuard, AuthRoleGuard)
@ApiBearerAuth()
@ApiProduces('application/json')
@ApiConsumes('application/json')
export class PostMemberController {
    constructor(private postMemberService: PostMemberService) {}

    private async getListPost(
        request: AccountIdExtensionRequest,
        query: PostMemberGetListRequest,
        occupationList: [string] | undefined,
        constructionMachineryList: [string],
        experienceTypeList: [string] | undefined,
        siteId: number,
    ): Promise<BaseResponse<PostMemberGetListResponse>> {
        // Check validation
        const parsedOccupationList = occupationList?.map((item) => {
            const parsedItem = parseInt(item);
            if (isNaN(parsedItem)) throw new BadRequestException('Occupation list item must be in type number');
            return parsedItem;
        });
        const parsedConstructionMachineryList = constructionMachineryList?.map((item) => {
            const parsedItem = parseInt(item);
            if (isNaN(parsedItem)) throw new BadRequestException('ConstructionMachinary list item must be in type number');
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
        query.constructionMachineryList = parsedConstructionMachineryList;
        query.experienceTypeList = parsedExperienceTypeList;

        const list = await this.postMemberService.getList(request.user.accountId, query, siteId);
        const total = await this.postMemberService.getTotal();
        const paginationResponse = new PaginationResponse(list, new PageInfo(total));
        return BaseResponse.of(paginationResponse);
    }

    // Get list all
    @Get()
    @ApiOperation({
        summary: 'Get list of posts',
        description: 'Member can retrieve all posts',
    })
    @ApiOkResponsePaginated(PostResponse)
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: BaseResponse })
    async getList(
        @Query() query: PostMemberGetListRequest,
        @Query('occupationList', new ParseArrayPipe({ optional: true })) occupationList: [string] | undefined,
        @Query('constructionMachineryList', new ParseArrayPipe({ optional: true })) constructionMachineryList: [string],
        @Query('experienceTypeList', new ParseArrayPipe({ optional: true })) experienceTypeList: [string] | undefined,
        @Req() request: AccountIdExtensionRequest,
    ): Promise<BaseResponse<PostMemberGetListResponse>> {
        return await this.getListPost(request, query, occupationList, constructionMachineryList, experienceTypeList, undefined);
    }

    // Get list by site id
    @Get('sites/:id')
    @ApiOperation({
        summary: 'Get list of posts by siteId',
        description: 'Member can retrieve all posts related to a site',
    })
    @ApiOkResponsePaginated(PostResponse)
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: BaseResponse })
    async getListPostsBySite(
        @Param('id', ParseIntPipe) siteId: number,
        @Query() query: PostMemberGetListRequest,
        @Query('occupationList', new ParseArrayPipe({ optional: true })) occupationList: [string] | undefined,
        @Query('constructionMachineryList', new ParseArrayPipe({ optional: true })) constructionMachineryList: [string],
        @Query('experienceTypeList', new ParseArrayPipe({ optional: true })) experienceTypeList: [string] | undefined,
        @Req() request: AccountIdExtensionRequest,
    ): Promise<BaseResponse<PostMemberGetListResponse>> {
        return await this.getListPost(request, query, occupationList, constructionMachineryList, experienceTypeList, siteId);
    }

    // Get detail
    @Get(':id')
    @ApiOperation({
        summary: 'Get post information detail',
        description: 'Member can retrieve information detail of certain post',
    })
    @ApiResponse({ status: HttpStatus.OK, type: PostMemberGetDetailResponse })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: BaseResponse })
    async getDetail(
        @Param('id', ParseIntPipe) id: number,
        @Req() request: AccountIdExtensionRequest,
    ): Promise<BaseResponse<PostMemberGetDetailResponse>> {
        return BaseResponse.of(await this.postMemberService.getDetail(id, request.user.accountId));
    }

    // Apply
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

    // Interest
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
