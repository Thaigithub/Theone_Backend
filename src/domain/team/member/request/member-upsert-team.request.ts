import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class MemberCreateTeamRequest {
    @Expose()
    @IsString()
    @ApiProperty({ type: 'string', example: 'Team A' })
    teamName: string;

    @Expose()
    @IsString()
    @ApiProperty({ type: 'string', example: 'Team A introduction' })
    introduction: string;

    @Expose()
    @IsNumber()
    @ApiProperty({ type: Number })
    codeId: number;

    @Expose()
    @IsNumber()
    @ApiProperty({ type: Number, example: 1 })
    dictrictId: number;

    @Expose()
    @IsString()
    @ApiProperty({ type: 'string', example: '12345' })
    sequenceDigit: string;
}

export class MemberUpdateExposureStatusTeamRequest {
    @Expose()
    @IsBoolean()
    @ApiProperty({ type: Boolean, example: true })
    exposureStatus: boolean;
}
