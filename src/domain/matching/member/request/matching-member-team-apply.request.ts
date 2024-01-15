import { Expose, Transform } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class MatchingMemberTeamApplyRequest {
    @Expose()
    @IsNumber()
    @Transform(({ value }) => value && parseInt(value))
    teamId: number;
}
