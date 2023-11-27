import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString, IsNumberString, IsOptional } from 'class-validator';
import { AccountStatus } from '@prisma/client'
export class CompanySearchRequest {
    @Expose()
    @IsString()
    public status: AccountStatus

    @Expose()
    @IsOptional()
    @IsString()
    @ApiProperty({ example: 'TheOne' })
    public name: string

    @Expose()
    @IsOptional()
    @IsString()
    @ApiProperty({ example: '0123456789' })
    public phone: string

    @Expose()
    @IsOptional()
    @IsNumberString()
    @ApiProperty({ example: '1' })
    public id: string

    
    @Expose()
    @IsOptional()
    @IsNumberString()
    @ApiProperty({ example: '1' })
    public pagenumber: string

    @Expose()
    @IsOptional()
    @IsNumberString()
    @ApiProperty({ example: '1' })
    public pagesize: string
}