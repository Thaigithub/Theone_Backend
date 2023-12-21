import { ApiProperty } from '@nestjs/swagger';
import { ContractStatus } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsDateString, IsEmail, IsEnum, IsNumber, IsString, Matches } from 'class-validator';

export class SiteCompanyCreateRequest {
    @ApiProperty({
        type: 'string',
        required: true,
    })
    @IsString()
    @Expose()
    public name: string;

    @ApiProperty({
        type: 'string',
        required: true,
    })
    @IsString()
    @Expose()
    public address: string;

    @ApiProperty({
        type: 'string',
        required: true,
    })
    @IsString()
    @Expose()
    public addressCity: string;

    @ApiProperty({
        type: 'string',
        required: true,
    })
    @IsString()
    @Expose()
    public addressDistrict: string;

    @ApiProperty({
        type: 'string',
        required: true,
    })
    @IsString()
    @Expose()
    public originalBuilding: string;

    @ApiProperty({
        type: 'string',
        required: true,
    })
    @IsString()
    @Expose()
    public contact: string;

    @ApiProperty({
        type: 'string',
        required: true,
    })
    @IsString()
    @Expose()
    public personInCharge: string;

    @ApiProperty({
        type: 'string',
        required: true,
    })
    @IsString()
    @Expose()
    public personInChargeContact: string;

    @ApiProperty({
        type: 'string',
        required: true,
    })
    @IsEmail()
    @Expose()
    public email: string;

    @ApiProperty({
        type: 'string',
        required: true,
    })
    @IsEmail()
    @Expose()
    public taxInvoiceEmail: string;

    @ApiProperty({
        type: 'string',
        required: true,
    })
    @IsString()
    @Expose()
    public siteManagementNumber: string;

    @ApiProperty({
        type: 'enum',
        enum: ContractStatus,
        required: true,
    })
    @IsEnum(ContractStatus)
    @Expose()
    public contractStatus: ContractStatus;

    @ApiProperty({
        type: 'number',
        required: true,
    })
    @IsNumber()
    @Expose()
    public longitude: number;

    @ApiProperty({
        type: 'number',
        required: true,
    })
    @IsNumber()
    @Expose()
    public latitude: number;

    @ApiProperty({
        type: 'string',
        format: 'date',
        required: true,
    })
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
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'The property must be in the format yyyy-mm-dd.',
    })
    @IsDateString()
    @Expose()
    public endDate: string;
}
