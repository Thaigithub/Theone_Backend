import { FileType, SalaryType } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsEnum, IsNumber, IsString, Matches } from 'class-validator';

export class ContractCompanyCreateRequest {
    @IsNumber()
    @Expose()
    applicationId: number;

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
    @IsEnum(SalaryType)
    salaryType: SalaryType;

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
