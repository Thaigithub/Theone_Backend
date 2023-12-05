import { Controller } from '@nestjs/common';
import { ApiConsumes, ApiProduces, ApiTags } from '@nestjs/swagger';
import { AccountAdminService } from './account-admin.service';

@ApiTags('[ADMIN] Accounts')
@Controller('/admin/accounts')
@ApiProduces('application/json')
@ApiConsumes('application/json')
export class AccountAdminController {
    constructor(private accountAdminService: AccountAdminService) {}
}
