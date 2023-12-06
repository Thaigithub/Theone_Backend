import { ApiProperty } from '@nestjs/swagger';
import { AdminLevel, FunctionName } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsString, Length } from 'class-validator';
import { AccountUpsertRequest } from 'domain/account/request/account-upsert.request';

export class AdminUpsertRequest extends AccountUpsertRequest {
    @Expose()
    @IsEnum(AdminLevel)
    @ApiProperty({
        type: 'enum',
        enum: AdminLevel,
        example: AdminLevel,
    })
    public level: AdminLevel;

    @Expose()
    @IsString()
    @ApiProperty({ example: 'abc' })
    @Length(1, 20, { message: 'Administrator name should be maximum 20 characters' })
    @IsNotEmpty({ message: 'Password is required' })
    public name: string;

    @Expose()
    @ApiProperty({
        type: 'FunctionName[]',
        example: '',
    })
    public permissions: FunctionName[];
}
