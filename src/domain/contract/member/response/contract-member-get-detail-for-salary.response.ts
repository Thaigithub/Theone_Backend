import { PaymentForm, SalaryType } from '@prisma/client';
import { FileResponse } from 'utils/generics/file.response';
import { SalaryHistory } from '../dto/labor-company-salary.dto';

export class ContractMemberGetDetailForSalaryResponse {
    companyName: string;
    siteName: string;
    companyLogo: FileResponse;
    name: string;
    paymentForm: PaymentForm;
    salaryType: SalaryType;
    totalDays: number;
    totalHours: number;
    startDate: Date;
    endDate: Date;
    salaryHistories: SalaryHistory[];
}
