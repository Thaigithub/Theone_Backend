import { Expose } from 'class-transformer';
import { IsNumber, IsString, Min } from 'class-validator';

export class PointMemberCreateCurrencyExchangeRequest {
    @Expose()
    @IsNumber()
    bankId: number;

    @Expose()
    @IsString()
    bankAccountNumber: string;

    @Expose()
    @IsNumber()
    @Min(0)
    currencyExchangePoint: number;
}
