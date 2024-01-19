import { BannerRequest, RequestBannerStatus } from '@prisma/client';
import { FileResponse } from 'utils/generics/file.response';
import { PaginationResponse } from 'utils/generics/pagination.response';

class GetListAdvertisingRequestResponse {
    id: BannerRequest['id'];
    file: FileResponse;
    title: string;
    requestDate: Date;
    status: RequestBannerStatus;
    acceptDate: Date | null;
}

export class BannerAdminGetListAdvertisingRequestResponse extends PaginationResponse<GetListAdvertisingRequestResponse> {}
