import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class HeadhuntingAdminAddMemberRecommendationRequest {
    @ApiProperty({})
    @IsNumber()
    @Expose()
    requestId: number;

    @ApiProperty({})
    @IsNumber()
    @Expose()
    memberId: number;
}

export class HeadhuntingAdminAddTeamRecommendationRequest {
    @ApiProperty({})
    @IsNumber()
    @Expose()
    requestId: number;

    @ApiProperty({})
    @IsNumber()
    @Expose()
    teamId: number;
}
