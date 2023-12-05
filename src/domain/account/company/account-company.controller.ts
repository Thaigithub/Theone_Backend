import { Controller } from '@nestjs/common';
import { ApiConsumes, ApiProduces, ApiTags } from '@nestjs/swagger';
import { AccountCompanyService } from './account-company.service';

@ApiTags('[COMPANY] Accounts')
@Controller('/company/accounts')
@ApiProduces('application/json')
@ApiConsumes('application/json')
export class AccountCompanyController {
    constructor(private accountCompanyService: AccountCompanyService) {}
}
