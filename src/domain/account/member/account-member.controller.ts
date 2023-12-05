import { Controller } from '@nestjs/common';
import { ApiConsumes, ApiProduces, ApiTags } from '@nestjs/swagger';
import { AccountMemberService } from './account-member.service';

@ApiTags('[MEMBER] Accounts')
@Controller('/member/accounts')
@ApiProduces('application/json')
@ApiConsumes('application/json')
export class AccountCompanyController {
    constructor(private accountMemberService: AccountMemberService) {}
}
