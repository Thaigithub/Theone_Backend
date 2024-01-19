import { SalaryType } from '@prisma/client';
import { LaborType } from '../enum/labor-company-labor-type.enum';

export class SalaryHistory {
    base: number;
    otherAllowance: number;
    overtimePay: number;
    meals: number;
    totalPayment: number;
    nationalPension: number;
    healthInsurance: number;
    longTermCare: number;
    employmentInsurance: number;
    retirementDeduction: number;
    incomeTax: number;
    residentTax: number;
    totalDeductible: number;
    actualPayment: number;
    date: Date;
}

class WorkDate {
    date: Date;
    hours: number;
}
export class LaborCompanyGetDetailResponse {
    id: number;
    type: LaborType;
    name: string;
    contact: string;
    siteName: string;
    startDate: Date;
    endDate: Date;
    salaryType: SalaryType;
    amount: number;
    workDate: WorkDate[];
    salaryHistory: SalaryHistory[];
}
