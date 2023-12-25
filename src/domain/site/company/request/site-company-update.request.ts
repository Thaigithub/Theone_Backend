import { ApiProperty } from '@nestjs/swagger';
import { ContractStatus } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsDateString, IsEmail, IsEnum, IsOptional, IsString, Matches } from 'class-validator';

export class SiteCompanyUpdateRequest {
    @ApiProperty({
        type: 'string',
        required: true,
    })
    @IsOptional()
    @IsString()
    @Expose()
    public name: string;

    @ApiProperty({
        type: 'string',
        required: true,
    })
    @IsOptional()
    @IsString()
    @Expose()
    public address: string;

    @Expose()
    @IsString()
    @IsOptional()
    @Matches(/^\d+-\d+$/, {
        message: 'Invalid format. Please use the format: "123-456".',
    })
    public regionId: string;

    @ApiProperty({
        type: 'string',
        required: true,
    })
    @IsOptional()
    @IsString()
    @Expose()
    public contact: string;

    @ApiProperty({
        type: 'string',
        required: true,
    })
    @IsOptional()
    @IsString()
    @Expose()
    public personInCharge: string;

    @ApiProperty({
        type: 'string',
        required: true,
    })
    @IsOptional()
    @IsString()
    @Expose()
    public personInChargeContact: string;

    @ApiProperty({
        type: 'string',
        required: true,
    })
    @IsOptional()
    @IsEmail()
    @Expose()
    public email: string;

    @ApiProperty({
        type: 'string',
        required: true,
    })
    @IsOptional()
    @IsEmail()
    @Expose()
    public taxInvoiceEmail: string;

    @ApiProperty({
        type: 'string',
        required: true,
    })
    @IsOptional()
    @IsString()
    @Expose()
    public siteManagementNumber: string;

    @ApiProperty({
        type: 'enum',
        enum: ContractStatus,
        required: true,
    })
    @IsOptional()
    @IsEnum(ContractStatus)
    @Expose()
    public contractStatus: ContractStatus;

    @ApiProperty({
        type: 'string',
        format: 'date',
        required: true,
    })
    @IsOptional()
    @IsDateString()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'The property must be in the format yyyy-mm-dd.',
    })
    @Expose()
    public startDate: string;

    @ApiProperty({
        type: 'string',
        format: 'date',
        required: true,
    })
    @IsOptional()
    @IsDateString()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'The property must be in the format yyyy-mm-dd.',
    })
    @Expose()
    public endDate: string;
}
