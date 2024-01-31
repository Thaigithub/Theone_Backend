import { PaginationResponse } from 'utils/generics/pagination.response';

class GetListResponse {
    name: string;
}
export class BankMemberGetListResponse extends PaginationResponse<GetListResponse> {}
