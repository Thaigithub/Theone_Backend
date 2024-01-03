import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class TeamMemberGetInviteRequest {
    @Expose()
    @IsNumber()
    @ApiProperty({ type: Number, example: 1 })
    public id: number;
}
