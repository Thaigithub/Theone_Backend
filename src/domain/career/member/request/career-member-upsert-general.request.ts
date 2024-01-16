import { Expose } from 'class-transformer';
import { IsBoolean, IsDateString, IsNotEmpty, IsNumber, IsString, Matches } from 'class-validator';

export class CareerMemberUpsertGeneralRequest {
    @Expose()
    @IsString()
    @IsNotEmpty()
    companyName: string;

    @Expose()
    @IsString()
    @IsNotEmpty()
    siteName: string;

    @Expose()
    @IsDateString()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'Date must be in the format yyyy-mm-dd.',
    })
    startDate: string;

    @Expose()
    @IsDateString()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'Date must be in the format yyyy-mm-dd.',
    })
    endDate: string;

    @Expose()
    @IsNumber()
    occupationId: number;

    @Expose()
    @IsBoolean()
    isExperienced: boolean;
}
