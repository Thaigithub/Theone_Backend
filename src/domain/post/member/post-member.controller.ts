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
import { AccountType, CodeType, ExperienceType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { BaseResponse } from 'utils/generics/base.response';
import { PostMemberService } from './post-member.service';
import { PostMemberUpdateInterestResponse } from './response/post-member-update-interest.response';
import {
    ConstructionMachinaryResponse,
    OccupationResponse,
    PostMemberGetListResponse,
    PostResponse,
} from './response/post-member-get-list.response';
import { PageInfo, PaginationResponse } from 'utils/generics/pageInfo.response';
import { ApiOkResponsePaginated } from 'utils/generics/pagination.decorator.reponse';
import { PostMemberGetListRequest } from './request/post-member-get-list.request';
import { AccountIdExtensionRequest } from 'utils/generics/upsert-account.request';

@ApiTags('[MEMBER] Posts Management')
@Controller('/member/posts')
@Roles(AccountType.MEMBER)
@UseGuards(AuthJwtGuard, AuthRoleGuard)
@ApiBearerAuth()
@ApiProduces('application/json')
@ApiConsumes('application/json')
export class PostMemberController {
    constructor(private postMemberService: PostMemberService) {}

    @Get('occupation')
    @ApiOperation({
        summary: 'Get list of occupation',
        description: 'Member can retrieve all occupation when drop down filter by occupation',
    })
    @ApiResponse({ status: HttpStatus.OK, type: [OccupationResponse] })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: BaseResponse })
    async getOccupationList(): Promise<BaseResponse<OccupationResponse[]>> {
        return BaseResponse.of(await this.postMemberService.getCodeList(CodeType.JOB));
    }

    @Get('construction-machinary')
    @ApiOperation({
        summary: 'Get list of construction machinary',
        description: 'Member can retrieve all occupation when drop down filter by occupation',
    })
    @ApiResponse({ status: HttpStatus.OK, type: [ConstructionMachinaryResponse] })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: BaseResponse })
    async getConstructionMachinaryList(): Promise<BaseResponse<ConstructionMachinaryResponse[]>> {
        return BaseResponse.of(await this.postMemberService.getCodeList(CodeType.SPECIAL_NOTE));
    }

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

        const list = await this.postMemberService.getList(query, request.user.accountId);
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
