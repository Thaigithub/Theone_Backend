import { PaymentForm } from '@prisma/client';
import { SalaryHistory } from '../dto/labor-company-salary.dto';
import { LaborType } from '../enum/labor-company-labor-type.enum';
class SalaryHistoryResponse extends SalaryHistory {
    id: number;
}
export class LaborCompanyGetDetailResponse {
    id: number;
    type: LaborType;
    name: string;
    contact: string;
    siteName: string;
    startDate: Date;
    endDate: Date;
    paymentForm: PaymentForm;
    amount: number;
    numberOfHours: number;
    workDate: Date[];
    salaryHistory: SalaryHistoryResponse[];
}
