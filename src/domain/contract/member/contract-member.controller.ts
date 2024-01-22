import { Controller, Get, Param, ParseIntPipe, Query, Req, UseGuards } from '@nestjs/common';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { BaseRequest } from 'utils/generics/base.request';
import { BaseResponse } from 'utils/generics/base.response';
import { ContractMemberService } from './contract-member.service';
import { ContractMemberGetListForSalaryRequest } from './request/contract-member-get-list-for-salary.request';
import { ContractMemberGetListRequest } from './request/contract-member-get-list.request';
import { ContractMemberGetDetailForSalaryResponse } from './response/contract-member-get-detail-for-salary.response';
import { ContractMemberGetDetailResponse } from './response/contract-member-get-detail.response';
import { ContractMemberGetListForSalaryResponse } from './response/contract-member-get-list-for-salary.response';
import { ContractMemberGetListResponse } from './response/contract-member-get-list.response';

@Controller('/member/contracts')
@Roles(AccountType.MEMBER)
@UseGuards(AuthJwtGuard, AuthRoleGuard)
export class ContractMemberController {
    constructor(private contractMemberService: ContractMemberService) {}

    @Get('/:id/salary-site')
    async geDetailForSalary(
        @Req() req: BaseRequest,
        @Param('id', ParseIntPipe) id: number,
    ): Promise<BaseResponse<ContractMemberGetDetailForSalaryResponse>> {
        return BaseResponse.of(await this.contractMemberService.getDetailForSalary(req.user.accountId, id));
    }

    @Get('/salary-site')
    async getListForSalary(
        @Query() query: ContractMemberGetListForSalaryRequest,
        @Req() req: BaseRequest,
    ): Promise<BaseResponse<ContractMemberGetListForSalaryResponse>> {
        return BaseResponse.of(await this.contractMemberService.getListForSalary(req.user.accountId, query));
    }

    @Get('/count')
    async getTotal(@Req() request: BaseRequest): Promise<BaseResponse<number>> {
        return BaseResponse.of(await this.contractMemberService.getTotal(request.user.accountId));
    }

    @Get('/:id')
    async getDetail(
        @Param('id', ParseIntPipe) id: number,
        @Req() req: BaseRequest,
    ): Promise<BaseResponse<ContractMemberGetDetailResponse>> {
        return BaseResponse.of(await this.contractMemberService.getDetail(req.user.accountId, id));
    }

    @Get()
    async getList(
        @Query() query: ContractMemberGetListRequest,
        @Req() req: BaseRequest,
    ): Promise<BaseResponse<ContractMemberGetListResponse>> {
        return BaseResponse.of(await this.contractMemberService.getList(req.user.accountId, query));
    }
}
