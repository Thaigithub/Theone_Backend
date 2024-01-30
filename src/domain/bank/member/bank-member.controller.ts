import { Controller, Get, UseGuards } from '@nestjs/common';
import { BaseResponse } from 'utils/generics/base.response';
import { BankMemberService } from './bank-member.service';
import { BankMemberGetListResponse } from './response/bank-member-get-list.response';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { AccountType } from '@prisma/client';

@Controller('/member/banks')
@UseGuards(AuthJwtGuard, AuthRoleGuard)
@Roles(AccountType.MEMBER)
export class BankMemberController {
    constructor(private readonly bankMemberService: BankMemberService) {}
    @Get()
    async getList(): Promise<BaseResponse<BankMemberGetListResponse[]>> {
        return BaseResponse.of(await this.bankMemberService.getList());
    }
}
