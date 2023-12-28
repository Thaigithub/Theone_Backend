import { Expose } from 'class-transformer';
import { IsNumber } from 'class-validator';
import { WorkDate } from '../dto/labor-company-workdate.dto';

export class LaborCompanyCreateSalaryRequest extends WorkDate {
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
}
