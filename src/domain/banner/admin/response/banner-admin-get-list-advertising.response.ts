import { AdvertisingBanner, BannerStatus } from '@prisma/client';
import { FileResponse } from 'utils/generics/file.response';
import { PaginationResponse } from 'utils/generics/pagination.response';

class GetListAdvertisingResponse {
    file: FileResponse;
    title: string;
    startDate: Date;
    endDate: Date;
    createDate: Date;
    status: BannerStatus;
    id: AdvertisingBanner['id'];
    priority: number | null;
}

export class BannerAdminGetListAdvertisingResponse extends PaginationResponse<GetListAdvertisingResponse> {}
