import { Expose } from 'class-transformer';
import { IsNumber, Matches } from 'class-validator';

export class SalaryHistory {
    @Expose()
    @IsNumber()
    base: number;
    @Expose()
    @IsNumber()
    otherAllowance: number;
    @Expose()
    @IsNumber()
    overtimePay: number;
    @Expose()
    @IsNumber()
    meals: number;
    @Expose()
    @IsNumber()
    totalPayment: number;
    @Expose()
    @IsNumber()
    nationalPension: number;
    @Expose()
    @IsNumber()
    healthInsurance: number;
    @Expose()
    @IsNumber()
    longTermCare: number;
    @Expose()
    @IsNumber()
    employmentInsurance: number;
    @Expose()
    @IsNumber()
    retirementDeduction: number;
    @Expose()
    @IsNumber()
    incomeTax: number;
    @Expose()
    @IsNumber()
    residentTax: number;
    @Expose()
    @IsNumber()
    totalDeductible: number;
    @Expose()
    @IsNumber()
    actualPayment: number;

    @Expose()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'The property must be in the format yyyy-mm-dd.',
    })
    date: string;
}
