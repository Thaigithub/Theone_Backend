import { SalaryType } from '@prisma/client';
import { FileResponse } from 'utils/generics/file.response';
import { PaginationResponse } from 'utils/generics/pagination.response';

export class GetListForSalaryResponse {
    id: number;
    companyLogo: FileResponse;
    companyName: string;
    startDate: Date;
    endDate: Date;
    salaryType: SalaryType;
    amount: number;
    totalDays: number;
    totalHours: number;
}
export class ContractMemberGetListForSalaryResponse extends PaginationResponse<GetListForSalaryResponse> {}
