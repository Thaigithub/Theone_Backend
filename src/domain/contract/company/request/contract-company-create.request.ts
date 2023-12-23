import { FileType, PaymentForm } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsEnum, IsNumber, IsNumberString, IsString, Matches } from 'class-validator';

export class ContractCompanyCreateRequest {
    @IsNumber()
    @Expose()
    applicationId: number;

    @IsNumberString()
    @Expose()
    contractNumber: string;

    @Expose()
    @IsString()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'The property must be in the format yyyy-mm-dd.',
    })
    startDate: string;

    @Expose()
    @IsString()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'The property must be in the format yyyy-mm-dd.',
    })
    endDate: string;

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
}
