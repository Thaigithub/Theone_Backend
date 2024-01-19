import { BannerStatus, PostBanner } from '@prisma/client';
import { FileResponse } from 'utils/generics/file.response';
import { PaginationResponse } from 'utils/generics/pagination.response';

class GetListPostResponse {
    file: FileResponse;
    postName: string;
    startDate: Date;
    endDate: Date;
    regDate: Date;
    status: BannerStatus;
    priority: number | null;
    id: PostBanner['id'];
}

export class BannerAdminGetListPostResponse extends PaginationResponse<GetListPostResponse> {}
