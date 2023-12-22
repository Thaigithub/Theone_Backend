import { PaginationResponse } from 'utils/generics/pageInfo.response';

export class GetPostBySite {
    id: number;
    name: string;
}
export class PostCompanyGetListBySite extends PaginationResponse<GetPostBySite> {}
