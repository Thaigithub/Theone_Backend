import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class HeadhuntingAdminAddMemberRecommendationRequest {
    @ApiProperty({})
    @IsNumber()
    @Expose()
    public requestId: number;

    @ApiProperty({})
    @IsNumber()
    @Expose()
    public memberId: number;
}

export class HeadhuntingAdminAddTeamRecommendationRequest {
    @ApiProperty({})
    @IsNumber()
    @Expose()
    public requestId: number;

    @ApiProperty({})
    @IsNumber()
    @Expose()
    public teamId: number;
}
