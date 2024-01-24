import { Expose } from 'class-transformer';
import { IsOptional, IsString, Matches } from 'class-validator';

export class MemoMemberUpsertRequest {
    @Expose()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'Date must be in the format yyyy-mm-dd.',
    })
    startDate: string;

    @Expose()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'Date must be in the format yyyy-mm-dd.',
    })
    endDate: string;

    @Expose()
    @IsString()
    @IsOptional()
    note: string;
}
