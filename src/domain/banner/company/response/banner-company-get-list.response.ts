import { PaginationResponse } from 'utils/generics/pagination.response';
import { BannerCompanyBannerStatus } from '../enum/banner-company-banner-status.enum';

class GetListResponse {
    bannerStatus: BannerCompanyBannerStatus;
    name: string;
    info: string;
    startDate: Date;
    endDate: Date;
    requestDate: Date;
}
export class BannerCompanyGetListResponse extends PaginationResponse<GetListResponse> {}
