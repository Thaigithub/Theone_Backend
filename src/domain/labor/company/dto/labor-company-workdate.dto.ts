import { Expose } from 'class-transformer';
import { IsNumber, Matches } from 'class-validator';

export class LaborCompanyWorkDateDTO {
    @Expose()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'Date must be in the format yyyy-mm-dd.',
    })
    date: string;

    @Expose()
    @IsNumber()
    hours: number;
}
