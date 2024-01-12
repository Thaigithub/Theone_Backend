import { BannerRequest } from '../dto/banner-admin-request.dto';
import { BannerAdminGetDetailAdvertisingResponse } from './banner-admin-get-detail-advertising.response';

export class BannerAdminGetDetailAdvertisingRequestResponse extends BannerAdminGetDetailAdvertisingResponse {
    request: BannerRequest;
}
