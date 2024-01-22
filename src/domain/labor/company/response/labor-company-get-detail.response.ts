import { PaymentForm, SalaryType } from '@prisma/client';
import { LaborCompanyGetListType } from '../enum/labor-company-get-list-type.enum';

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
    type: LaborCompanyGetListType;
    name: string;
    contact: string;
    siteName: string;
    startDate: Date;
    endDate: Date;
    salaryType: SalaryType;
    paymentForm: PaymentForm;
    amount: number;
    workDate: WorkDate[];
    salaryHistory: SalaryHistory[];
}
