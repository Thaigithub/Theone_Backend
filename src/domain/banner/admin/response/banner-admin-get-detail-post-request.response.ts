import { BannerRequest } from '../dto/banner-admin-request.dto';
import { BannerAdminGetDetailPostResponse } from './banner-admin-get-detail-post.response';

export class BannerAdminGetDetailPostRequestResponse extends BannerAdminGetDetailPostResponse {
    request: BannerRequest;
}
