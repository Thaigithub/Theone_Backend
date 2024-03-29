import { FileResponse } from 'utils/generics/file.response';
import { PaginationResponse } from 'utils/generics/pagination.response';

class GetListPremium {
    companyLogo: FileResponse;
    postName: string;
    id: number;
    siteName: string | null;
    occupationName: string;
    endDate: Date;
    siteAddress: string;
    isInterested: boolean | null;
    urlLogo: string;
}
export class PostMemberGetListPremiumResponse extends PaginationResponse<GetListPremium> {}
