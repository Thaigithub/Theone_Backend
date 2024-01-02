import { SalaryType } from '@prisma/client';
import { SalaryHistory } from '../dto/labor-company-salary.dto';
import { LaborType } from '../enum/labor-company-labor-type.enum';
class SalaryHistoryResponse extends SalaryHistory {
    id: number;
}
class WorkDate {
    id: number;
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
    salaryHistory: SalaryHistoryResponse[];
}
