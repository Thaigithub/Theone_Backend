import { Company, Site } from '@prisma/client';
import { PaginationResponse } from 'utils/generics/pagination.response';

class SalaryReportResponse {
    companyName: Company['name'];
    siteName: Site['name'];
    contact: Site['contact'];
    requestDate: string;
}

export class SalaryReportAdminGetListResponse extends PaginationResponse<SalaryReportResponse> {}
