import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class MemberMemberAddSiteOrPost {
    @Expose()
    @ApiProperty({ type: 'number', example: 1 })
    @IsNumber()
    public id: number;
}
