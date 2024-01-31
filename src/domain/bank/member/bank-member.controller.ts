import { Controller, Get, UseGuards } from '@nestjs/common';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { BaseResponse } from 'utils/generics/base.response';
import { BankMemberService } from './bank-member.service';
import { BankMemberGetListResponse } from './response/bank-member-get-list.response';

@Roles(AccountType.MEMBER)
@UseGuards(AuthJwtGuard, AuthRoleGuard)
@Controller('/member/banks')
export class BankMemberController {
    constructor(private bankMemberService: BankMemberService) {}

    @Get()
    async getBankList(): Promise<BaseResponse<BankMemberGetListResponse>> {
        return BaseResponse.of(await this.bankMemberService.getList());
    }
}
