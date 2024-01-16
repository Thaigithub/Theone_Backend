import { ContractStatus } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsDateString, IsEmail, IsEnum, IsNumber, IsOptional, IsString, Matches } from 'class-validator';

export class SiteCompanyUpdateRequest {
    @IsOptional()
    @IsString()
    @Expose()
    name: string;

    @IsOptional()
    @IsString()
    @Expose()
    address: string;

    @Expose()
    @IsNumber()
    @IsOptional()
    districtId: number;

    @IsOptional()
    @IsString()
    @Expose()
    contact: string;

    @IsOptional()
    @IsString()
    @Expose()
    personInCharge: string;

    @IsOptional()
    @IsString()
    @Expose()
    personInChargeContact: string;

    @IsOptional()
    @IsEmail()
    @Expose()
    email: string;

    @IsOptional()
    @IsEmail()
    @Expose()
    taxInvoiceEmail: string;

    @IsOptional()
    @IsString()
    @Expose()
    siteManagementNumber: string;

    @IsOptional()
    @IsEnum(ContractStatus)
    @Expose()
    contractStatus: ContractStatus;

    @IsOptional()
    @IsDateString()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'Date must be in the format yyyy-mm-dd.',
    })
    @Expose()
    startDate: string;

    @IsOptional()
    @IsDateString()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'Date must be in the format yyyy-mm-dd.',
    })
    @Expose()
    endDate: string;
}
