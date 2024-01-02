import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class PointMemberCreateCurrencyExchangeRequest {
    @Expose()
    @IsNumber()
    @ApiProperty({ type: Number, example: 1 })
    public bankId: number;

    @Expose()
    @IsString()
    @ApiProperty({ type: 'string', example: '000-000-000000000' })
    public bankAccountNumber: string;

    @Expose()
    @IsNumber()
    @ApiProperty({ type: Number, example: 1 })
    public currencyExchangePoint: number;
}
