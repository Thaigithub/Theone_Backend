import { Controller, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiProduces, ApiTags } from '@nestjs/swagger';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { MemberMemberService } from './member-member.service';

@ApiTags('[MEMBER] Member Management')
@Roles(AccountType.MEMBER)
@UseGuards(AuthJwtGuard, AuthRoleGuard)
@ApiBearerAuth()
@Controller('member/members')
@ApiProduces('application/json')
@ApiConsumes('application/json')
export class MemberMemberController {
    constructor(private readonly memberMemberService: MemberMemberService) {}
}
