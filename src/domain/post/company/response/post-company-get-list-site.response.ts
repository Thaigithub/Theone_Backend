import { PaginationResponse } from 'utils/generics/pagination.response';

export class GetListSiteResponse {
    id: number;
    name: string;
}
export class PostCompanyGetListSiteResponse extends PaginationResponse<GetListSiteResponse> {}
