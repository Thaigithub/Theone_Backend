import { Module } from '@nestjs/common';
import { PrismaModule } from 'services/prisma/prisma.module';
import { MemberTeamMemberInvitationController } from './member/team-member-invitation-member.controller';
import { MemberTeamMemberInvitationService } from './member/team-member-invitation-member.service';

@Module({
    imports: [PrismaModule],
    controllers: [MemberTeamMemberInvitationController],
    providers: [MemberTeamMemberInvitationService],
    exports: [],
})
export class TeamMemberInvitationModule {}
