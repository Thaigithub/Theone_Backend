import { Site } from '@prisma/client';
import { PaginationResponse } from 'utils/generics/pagination.response';

export class SalaryReportResponse {
    siteName: Site['name'];
    requestDate: string;
}

export class SalaryReportCompanyGetListResponse extends PaginationResponse<SalaryReportResponse> {}
