import { Expose } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class TeamMemberCreateInvitationRequest {
    @Expose()
    @IsNumber()
    id: number;
}
