import { PaginationResponse } from 'utils/generics/pagination.response';

export class WorkAdminGetDetailItemHistoryResponse {
    workerName: string;
    workDay: Date[];
}
export class WorkAdminGetDetailListHistoryResponse extends PaginationResponse<WorkAdminGetDetailItemHistoryResponse> {}
