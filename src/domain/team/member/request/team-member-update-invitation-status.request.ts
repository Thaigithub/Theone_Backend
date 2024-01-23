import { InvitationStatus } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsEnum } from 'class-validator';

export class TeamMemberUpdateInvitationStatus {
    @Expose()
    @IsEnum(InvitationStatus)
    status: InvitationStatus;
}
