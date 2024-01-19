import { Expose } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class HeadhuntingAdminAddMemberRecommendationRequest {
    @IsNumber()
    @Expose()
    requestId: number;

    @IsNumber()
    @Expose()
    memberId: number;
}

export class HeadhuntingAdminAddTeamRecommendationRequest {
    @IsNumber()
    @Expose()
    requestId: number;

    @IsNumber()
    @Expose()
    teamId: number;
}
