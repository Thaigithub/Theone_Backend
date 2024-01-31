import { Expose } from 'class-transformer';
import { IsNumber, Min } from 'class-validator';

export class PointMemberCreateCurrencyExchangeRequest {
    @Expose()
    @IsNumber()
    @Min(1)
    amount: number;
}
