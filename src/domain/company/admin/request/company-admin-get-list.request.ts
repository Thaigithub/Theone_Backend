import { ApiProperty } from '@nestjs/swagger';
import { $Enums, AccountStatus } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsEnum, IsNumberString, IsOptional, IsString } from 'class-validator';
export class AdminCompanyGetListRequest {
    @Expose()
    @IsEnum($Enums.AccountStatus)
    public status: AccountStatus;

    @Expose()
    @IsOptional()
    @IsString()
    @ApiProperty({ description: 'Company name', example: 'TheOne' })
    public name: string;

    @Expose()
    @IsOptional()
    @IsString()
    @ApiProperty({ description: 'Company phone', example: '0123456789' })
    public phone: string;

    @Expose()
    @IsOptional()
    @IsNumberString()
    @ApiProperty({ description: 'Company id', example: '1' })
    public id: string;

    @Expose()
    @IsOptional()
    @IsNumberString()
    @ApiProperty({ description: 'Page number', example: '1' })
    public pageNumber: string;

    @Expose()
    @IsOptional()
    @IsNumberString()
    @ApiProperty({ description: 'Page size', example: '1' })
    public pageSize: string;
}
