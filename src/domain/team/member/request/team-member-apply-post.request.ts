import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class TeamMemberApplyPost {
    @Expose()
    @ApiProperty({ type: 'number', example: 1 })
    @IsNumber()
    public teamId: number;

    @Expose()
    @ApiProperty({ type: 'number', example: 1 })
    @IsNumber()
    public postId: number;
}
