import { BannerRequest } from '@prisma/client';
import { PaginationResponse } from 'utils/generics/pagination.response';
import { BannerCompanyBannerStatus } from '../enum/banner-company-banner-status.enum';

class GetListRequestResponse {
    id: BannerRequest['id'];
    status: BannerCompanyBannerStatus;
    name: string;
    info: string;
    startDate: Date;
    endDate: Date;
    requestDate: Date;
}
export class BannerCompanyGetListRequestResponse extends PaginationResponse<GetListRequestResponse> {}
