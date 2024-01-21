import { PaginationResponse } from 'utils/generics/pagination.response';
import { LaborCompanyGetListType } from '../enum/labor-company-get-list-type.enum';

class GetListResponse {
    contractId: number;
    laborId: number;
    type: LaborCompanyGetListType;
    name: string;
    siteName: string;
    startDate: Date;
    endDate: Date;
}

export class LaborCompanyGetListResponse extends PaginationResponse<GetListResponse> {}
