import { Expose } from 'class-transformer';
import { IsNumber, Matches } from 'class-validator';

export class WorkDate {
    @Expose()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'The property must be in the format yyyy-mm-dd.',
    })
    public date: string;

    @Expose()
    @IsNumber()
    public hours: number;
}
