import { ContractStatus } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsDateString, IsEmail, IsEnum, IsNumber, IsString, Matches } from 'class-validator';

export class SiteCompanyCreateRequest {
    @IsString()
    @Expose()
    name: string;

    @IsString()
    @Expose()
    address: string;

    @Expose()
    @IsNumber()
    districtId: number;

    @IsString()
    @Expose()
    originalBuilding: string;

    @IsString()
    @Expose()
    contact: string;

    @IsString()
    @Expose()
    personInCharge: string;

    @IsString()
    @Expose()
    personInChargeContact: string;

    @IsEmail()
    @Expose()
    email: string;

    @IsEmail()
    @Expose()
    taxInvoiceEmail: string;

    @IsString()
    @Expose()
    siteManagementNumber: string;

    @IsEnum(ContractStatus)
    @Expose()
    contractStatus: ContractStatus;

    @IsNumber()
    @Expose()
    longitude: number;

    @IsNumber()
    @Expose()
    latitude: number;

    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'The property must be in the format yyyy-mm-dd.',
    })
    @Expose()
    @IsDateString()
    startDate: string;

    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'The property must be in the format yyyy-mm-dd.',
    })
    @Expose()
    @IsDateString()
    endDate: string;
}
