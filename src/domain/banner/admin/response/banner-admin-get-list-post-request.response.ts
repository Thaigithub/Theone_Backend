import { BannerRequest, Post, RequestBannerStatus } from '@prisma/client';
import { FileResponse } from 'utils/generics/file.response';
import { PaginationResponse } from 'utils/generics/pagination.response';

class GetListPostRequestResponse {
    postName: Post['name'];
    file: FileResponse;
    requestDate: Date;
    status: RequestBannerStatus;
    acceptDate: Date;
    id: BannerRequest['id'];
}

export class BannerAdminGetListPostRequestResponse extends PaginationResponse<GetListPostRequestResponse> {}
