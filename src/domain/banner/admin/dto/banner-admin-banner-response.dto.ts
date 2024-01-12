import { BannerStatus } from '@prisma/client';
import { FileResponse } from 'utils/generics/file.response';

export class BannerResponse {
    file: FileResponse;
    status: BannerStatus;
    startDate: Date;
    endDate: Date;
    createDate: Date;
}
