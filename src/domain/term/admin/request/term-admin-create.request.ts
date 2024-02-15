import { Expose } from 'class-transformer';
import { IsDateString, IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';

export class TermAdminCreateRequest {
    @Expose()
    @MaxLength(100)
    @IsString()
    @IsNotEmpty()
    title: string;

    @Expose()
    @MaxLength(5000)
    @IsString()
    @IsNotEmpty()
    content: string;

    @Expose()
    @IsDateString()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'Date must be in the format yyyy-mm-dd.',
    })
    @IsNotEmpty()
    revisionDate: string;
}
