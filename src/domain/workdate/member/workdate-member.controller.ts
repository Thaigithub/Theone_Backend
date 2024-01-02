import { Controller, Get, HttpStatus, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiProduces, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { WorkDateMemberService } from './workdate-member.service';
import { AccountIdExtensionRequest } from 'utils/generics/base.request';
import { BaseResponse } from 'utils/generics/base.response';

@ApiTags('[MEMBER] WorkDate Management')
@Controller('/member/workdates')
@Roles(AccountType.MEMBER)
@UseGuards(AuthJwtGuard, AuthRoleGuard)
@ApiProduces('application/json')
@ApiConsumes('application/json')
@ApiBearerAuth()
export class WorkDateMemberController {
    constructor(private readonly laborMemberService: WorkDateMemberService) {}

    @Get('count')
    @ApiOperation({
        summary: 'Get total shifts',
        description: 'Member can retrive total shifts',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        type: BaseResponse<number>,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        type: BaseResponse,
    })
    async getTotal(@Req() request: AccountIdExtensionRequest): Promise<BaseResponse<number>> {
        return BaseResponse.of(await this.laborMemberService.getTotal(request.user.accountId));
    }
}
