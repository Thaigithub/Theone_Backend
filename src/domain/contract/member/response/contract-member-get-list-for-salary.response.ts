import { SalaryType } from '@prisma/client';
import { FileResponse } from 'utils/generics/file.response';
import { PaginationResponse } from 'utils/generics/pagination.response';
import { ContractStatus } from '../enum/contract-member-status.enum';

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
    siteName: string;
    status: ContractStatus;
}
export class ContractMemberGetListForSalaryResponse extends PaginationResponse<GetListForSalaryResponse> {}
