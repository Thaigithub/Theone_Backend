import { BannerStatus } from '@prisma/client';
import { FileResponse } from 'utils/generics/file.response';
import { PaginationResponse } from 'utils/generics/pagination.response';

class GetListPostResponse {
    file: FileResponse;
    title: string;
    startDate: Date;
    endDate: Date;
    createDate: Date;
    status: BannerStatus;
}

export class BannerAdminGetListPostResponse extends PaginationResponse<GetListPostResponse> {}
