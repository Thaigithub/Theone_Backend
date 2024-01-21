import { Site } from '@prisma/client';
import { PaginationResponse } from 'utils/generics/pagination.response';

class GetListContract {
    siteId: Site['id'];
    siteName: Site['name'];
    startDate: Site['startDate'];
    endDate: Site['endDate'];
    numberOfContract: Site['numberOfContract'];
}
export class SiteCompanyGetListContractResponse extends PaginationResponse<GetListContract> {}
