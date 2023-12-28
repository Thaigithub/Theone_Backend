import { Controller, Get, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiProduces, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AccountType, CodeType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { BaseResponse } from 'utils/generics/base.response';
import { FilterService } from './filter.service';
import { CodeResponse } from './response/filter-get-code.response';

@Controller('filter')
@ApiTags('[MEMBER & COMPANY] Get filter drop down')
@Roles(AccountType.MEMBER, AccountType.COMPANY)
@UseGuards(AuthJwtGuard, AuthRoleGuard)
@ApiBearerAuth()
@ApiProduces('application/json')
@ApiConsumes('application/json')
@Controller()
export class FilterController {
    constructor(private readonly filterService: FilterService) {}

    @Get('occupation')
    @ApiOperation({
        summary: 'Get list of occupation',
        description: 'User can retrieve all occupation when drop down filter by occupation',
    })
    @ApiResponse({ status: HttpStatus.OK, type: [CodeResponse] })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: BaseResponse })
    async getOccupationList(): Promise<BaseResponse<CodeResponse[]>> {
        return BaseResponse.of(await this.filterService.getCodeList(CodeType.GENERAL));
    }

    @Get('construction-machinary')
    @ApiOperation({
        summary: 'Get list of construction machinary',
        description: 'User can retrieve all occupation when drop down filter by occupation',
    })
    @ApiResponse({ status: HttpStatus.OK, type: [CodeResponse] })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: BaseResponse })
    async getConstructionMachinaryList(): Promise<BaseResponse<CodeResponse[]>> {
        return BaseResponse.of(await this.filterService.getCodeList(CodeType.SPECIAL));
    }
}
