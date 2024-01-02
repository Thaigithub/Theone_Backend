import { PaymentForm, SalaryType } from '@prisma/client';
import { FileResponse } from 'utils/generics/file.response';

export class ContractMemberGetDetailForSalaryResponse {
    companyName: string;
    siteName: string;
    companyLogo: FileResponse;
    name: string;
    paymentForm: PaymentForm;
    salaryType: SalaryType;
    totalDays: number;
    totalHours: number;
    startDate: number;
    endDate: number;
}
