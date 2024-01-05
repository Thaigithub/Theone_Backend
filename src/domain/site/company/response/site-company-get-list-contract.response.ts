import { Site } from '@prisma/client';
import { PaginationResponse } from 'utils/generics/pagination.response';

export class GetListForContract {
    siteId: Site['id'];
    siteName: Site['name'];
    startDate: Site['startDate'];
    endDate: Site['endDate'];
    numberOfContract: Site['numberOfContract'];
}
export class SiteCompanyGetListForContractResponse extends PaginationResponse<GetListForContract> {}
