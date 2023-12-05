import { Controller } from '@nestjs/common';
import { ApiConsumes, ApiProduces, ApiTags } from '@nestjs/swagger';
import { MemberCompanyService } from './company-member.service';

@ApiTags('[MEMBER] Company Management')
@Controller('/member/companies')
@ApiProduces('application/json')
@ApiConsumes('application/json')
export class MemberCompanyController {
    constructor(private memberCompanyService: MemberCompanyService) {}
}
