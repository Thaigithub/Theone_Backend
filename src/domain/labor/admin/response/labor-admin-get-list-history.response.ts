import { PaginationResponse } from 'utils/generics/pagination.response';

export class GetListHistoryResponse {
    workerName: string;
    workDay: Date[];
}
export class LaborAdminGetListHistoryResponse extends PaginationResponse<GetListHistoryResponse> {}
