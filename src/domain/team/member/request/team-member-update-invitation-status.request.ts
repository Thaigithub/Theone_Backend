import { InvitationStatus } from '@prisma/client';
import { Expose } from 'class-transformer';

export class TeamMemberUpdateInvitationStatus {
    @Expose()
    status: InvitationStatus;
}
