import { BadRequestException, Controller, Get, HttpStatus, ParseArrayPipe, Query, UseGuards } from '@nestjs/common';
import { ManpowerCompanyService } from './manpower-company.service';
import { BaseResponse } from 'utils/generics/base.response';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiProduces, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { AccountType, ExperienceType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { ManpowerCompanyGetListRequest } from './request/manpower-company-get-list.request';
import { ApiOkResponsePaginated } from 'utils/generics/pagination.decorator';
import { ManpowerCompanyGetListResponse, ManpowerResponse } from './response/manpower-company-get-list.response';
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

    @Get()
    @ApiOperation({
        summary: 'Get list of posts',
        description: 'Member can retrieve all posts',
    })
    @ApiOkResponsePaginated(ManpowerResponse)
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: BaseResponse })
    async getList(
        @Query() query: ManpowerCompanyGetListRequest,
        @Query('occupationList', new ParseArrayPipe({ optional: true })) occupationList: [string] | undefined,
        @Query('experienceTypeList', new ParseArrayPipe({ optional: true })) experienceTypeList: [string] | undefined,
        @Query('regionList', new ParseArrayPipe({ optional: true })) regionList: [string] | undefined,
    ): Promise<BaseResponse<ManpowerCompanyGetListResponse>> {
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

        const list = await this.manpowerCompanyService.getList(query);
        const total = await this.manpowerCompanyService.getTotal(query);
        const paginationResponse = new PaginationResponse(list, new PageInfo(total));

        return BaseResponse.of(paginationResponse);
    }
}
