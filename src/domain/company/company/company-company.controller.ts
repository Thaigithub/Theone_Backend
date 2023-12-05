import { Controller } from '@nestjs/common';
import { ApiConsumes, ApiProduces, ApiTags } from '@nestjs/swagger';
import { CompanyCompanyService } from './company-company.service';

@ApiTags('[COMPANY] Company Management')
@Controller('/member/companies')
@ApiProduces('application/json')
@ApiConsumes('application/json')
export class CompanyCompanyController {
    constructor(private companyCompanyService: CompanyCompanyService) {}
}
