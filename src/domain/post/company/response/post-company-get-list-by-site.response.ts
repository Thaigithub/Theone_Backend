import { PaginationResponse } from 'utils/generics/pagination.response';

export class GetPostBySite {
    id: number;
    name: string;
}
export class PostCompanyGetListBySite extends PaginationResponse<GetPostBySite> {}
