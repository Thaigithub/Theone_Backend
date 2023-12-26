import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNumberString, IsString } from 'class-validator';

export class UpsertBankAccountRequest {
    @Expose()
    @IsString()
    @ApiProperty({ example: 'TheOne' })
    public accountHolder: string;

    @Expose()
    @IsNumberString()
    @ApiProperty({ example: '1233534' })
    public accountNumber: string;

    @Expose()
    @IsString()
    @ApiProperty({ example: 'ACB' })
    public bankName: string;
}
