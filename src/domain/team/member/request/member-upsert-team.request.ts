import { Expose } from 'class-transformer';
import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class MemberCreateTeamRequest {
    @Expose()
    @IsString()
    teamName: string;

    @Expose()
    @IsString()
    introduction: string;

    @Expose()
    @IsNumber()
    codeId: number;

    @Expose()
    @IsNumber()
    dictrictId: number;

    @Expose()
    @IsString()
    sequenceDigit: string;
}

export class MemberUpdateExposureStatusTeamRequest {
    @Expose()
    @IsBoolean()
    exposureStatus: boolean;
}
