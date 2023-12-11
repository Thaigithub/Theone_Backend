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
    Query,
    Request,
    UseGuards,
} from '@nestjs/common';
import { ApiConsumes, ApiOperation, ApiProduces, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { BaseResponse } from 'utils/generics/base.response';
import { PaginationResponse } from 'utils/generics/pageInfo.response';
import { SpecialLicenseMemberUpsertRequest } from './request/special-license-member-upsert.request';
import { SpecialLicenseMemberGetResponse } from './response/special-license-member.response';
import { SpecialLicenseService } from './special-license-member.service';

@ApiTags('[MEMBER] Special License Management')
@Controller('member/special-licenses')
@ApiProduces('application/json')
@ApiConsumes('application/json')
export class MemberSpecialLicenseController {
    constructor(@Inject(SpecialLicenseService) private readonly specialLicenseService: SpecialLicenseService) {}
    @Post('save')
    @HttpCode(200)
    @Roles(AccountType.MEMBER)
    @UseGuards(AuthJwtGuard, AuthRoleGuard)
    @ApiOperation({
        summary: 'Save a new special license',
        description: 'This endpoint is provided for use to upload new special license',
    })
    @ApiResponse({ status: HttpStatus.OK, type: BaseResponse })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: BaseResponse })
    async save(@Body() request: SpecialLicenseMemberUpsertRequest, @Request() req): Promise<BaseResponse<void>> {
        await this.specialLicenseService.saveSpecialLicense(req.user.accountId, request);
        return BaseResponse.ok();
    }

    @Get('')
    @HttpCode(200)
    @Roles(AccountType.MEMBER)
    @UseGuards(AuthJwtGuard, AuthRoleGuard)
    @ApiOperation({
        summary: 'Get all special licenses',
        description: 'This endpoint get all special licenses that users currently have',
    })
    @ApiResponse({ status: HttpStatus.OK, type: BaseResponse })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: BaseResponse })
    async getSpecialLicenses(
        @Query('page', ParseIntPipe) page: number, // Use @Query for query parameters
        @Query('size', ParseIntPipe) size: number,
        @Request() req,
    ): Promise<BaseResponse<PaginationResponse<SpecialLicenseMemberGetResponse>>> {
        const result = await this.specialLicenseService.getPaginatedSpecialLicenses({
            accountId: req.user.accountId,
            page: page,
            size: size,
        });
        return BaseResponse.of(result);
    }

    @Get(':id')
    @HttpCode(200)
    @Roles(AccountType.MEMBER)
    @UseGuards(AuthJwtGuard, AuthRoleGuard)
    @ApiOperation({
        summary: 'Get special license details',
        description: 'This endpoint get special license details',
    })
    @ApiResponse({ status: HttpStatus.OK, type: BaseResponse })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: BaseResponse })
    async getSpecialLicenseDetails(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<BaseResponse<SpecialLicenseMemberGetResponse>> {
        return BaseResponse.of(await this.specialLicenseService.getSpecialLicenseDetails(id));
    }

    @Put(':id')
    @HttpCode(200)
    @Roles(AccountType.MEMBER)
    @UseGuards(AuthJwtGuard, AuthRoleGuard)
    @ApiOperation({
        summary: 'Update special license',
        description: 'This endpoint update special license information',
    })
    @ApiResponse({ status: HttpStatus.OK, type: BaseResponse })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: BaseResponse })
    async updateSpecialLicense(
        @Param('id', ParseIntPipe) id: number,
        @Request() req,
        @Body() request: SpecialLicenseMemberUpsertRequest,
    ): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.specialLicenseService.update(req.user.accountId, id, request));
    }
}
