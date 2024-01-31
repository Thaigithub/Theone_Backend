import { RequestObject } from '@prisma/client';
import { PaginationResponse } from 'utils/generics/pagination.response';

class GetListResponse {
    contractId: number;
    laborId: number;
    type: RequestObject;
    name: string;
    siteName: string;
    startDate: Date;
    endDate: Date;
}

export class LaborCompanyGetListResponse extends PaginationResponse<GetListResponse> {}
