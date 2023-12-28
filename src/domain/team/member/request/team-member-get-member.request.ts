import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class TeamGetMemberRequest {
    @Expose()
    @ApiProperty({ type: 'string', example: 'user name' })
    @IsString()
    public username: string;

    @Expose()
    @ApiProperty({ type: 'string', example: 'user name' })
    @IsString()
    public contact: string;
}
