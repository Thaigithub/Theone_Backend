import { FileResponse } from 'utils/generics/file.response';

export class ContractMemberGetDetailResponse {
    companyLogo: FileResponse;
    siteName: string;
    siteAddress: string;
    siteStartDate: Date;
    siteEndDate: Date;
    startDate: Date;
    endDate: Date;
    created: Date;
    file: FileResponse;
    companyName: string;
    personInCharge: string;
}
