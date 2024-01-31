import { PaymentForm, RequestObject, SalaryType } from '@prisma/client';

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
    type: RequestObject;
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
