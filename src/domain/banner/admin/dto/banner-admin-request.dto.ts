import { Company, RequestBannerStatus } from '@prisma/client';

export class BannerRequest {
    companyName: Company['name'];
    contactName: Company['contactName'];
    status: RequestBannerStatus;
    acceptDate: Date;
    detail: string;
}
