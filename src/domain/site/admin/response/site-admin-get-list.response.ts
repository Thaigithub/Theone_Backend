import { Site } from '@prisma/client';
import { PaginationResponse } from 'utils/generics/pagination.response';

class SiteAdminResponse {
    id: Site['id'];
    name: Site['name'];
    contact: Site['contact'];
    personInChargeContact: Site['personInChargeContact'];
    contractStatus: Site['contractStatus'];
    startDate: Site['startDate'];
    endDate: Site['endDate'];
}

export class SiteAdminGetListResponse extends PaginationResponse<SiteAdminResponse> {}
