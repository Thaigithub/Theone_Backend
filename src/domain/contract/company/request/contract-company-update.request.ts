import { FileType, PaymentForm, SalaryType } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsEnum, IsNumber, IsString, Matches } from 'class-validator';

export class ContractCompanyUpdateRequest {
    @Expose()
    @IsString()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'Date must be in the format yyyy-mm-dd.',
    })
    startDate: Date;

    @Expose()
    @IsString()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'Date must be in the format yyyy-mm-dd.',
    })
    endDate: Date;

    @Expose()
    @IsEnum(SalaryType)
    salaryType: SalaryType;

    @Expose()
    @IsEnum(PaymentForm)
    paymentForm: PaymentForm;

    @Expose()
    @IsNumber()
    amount: number;

    @Expose()
    @IsString()
    fileKey: string;

    @Expose()
    @IsString()
    fileName: string;

    @Expose()
    @IsEnum(FileType)
    fileType: FileType;

    @Expose()
    @IsNumber()
    fileSize: number;

    @Expose()
    @IsString()
    department: string;

    @Expose()
    @IsString()
    manager: string;

    @Expose()
    @IsString()
    contact: string;
}