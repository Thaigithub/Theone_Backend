import { PaginationResponse } from 'utils/generics/pagination.response';
import { LaborType } from '../enum/labor-company-labor-type.enum';

class GetListResponse {
    contractId: number;
    laborId: number;
    type: LaborType;
    name: string;
    siteName: string;
    startDate: Date;
    endDate: Date;
}

export class LaborCompanyGetListResponse extends PaginationResponse<GetListResponse> {}
