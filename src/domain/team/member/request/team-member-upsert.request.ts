import { Expose } from 'class-transformer';
import { IsNumber, IsString, Length } from 'class-validator';

export class TeamMemberUpsertRequest {
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
    @Length(5)
    sequenceDigit: string;
}
