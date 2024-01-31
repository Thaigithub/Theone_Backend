import { SalaryType } from '@prisma/client';
import { FileResponse } from 'utils/generics/file.response';
import { PaginationResponse } from 'utils/generics/pagination.response';
import { ContractMemberGetListStatus } from '../enum/contract-member-get-list-status.enum';

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
    status: ContractMemberGetListStatus;
}
export class ContractMemberGetListForSalaryResponse extends PaginationResponse<GetListForSalaryResponse> {}
