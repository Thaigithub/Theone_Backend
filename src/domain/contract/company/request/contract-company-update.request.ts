import { PaymentForm, SalaryType } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsEnum, IsNotEmptyObject, IsNumber, IsString, Matches } from 'class-validator';
import { FileRequest } from 'utils/generics/file.request';

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
    @IsNotEmptyObject()
    file: FileRequest;

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
