import { PostApplicationStatus } from '@prisma/client';
import { FileResponse } from 'utils/generics/file.response';
import { PaginationResponse } from 'utils/generics/pagination.response';
import { OfferType } from '../enum/application-member-get-list-offer-type.enum';
export class GetOfferResponse {
    isLeader: boolean;
    type: OfferType;
    teamName: string | null;
    companyLogo: FileResponse;
    siteName: string;
    siteAddress: string;
    postName: string;
    requestDate: string;
    occupationName: string;
    applicationStatus: PostApplicationStatus;
    isHeadhunting: boolean;
}
export class ApplicationMemberGetListOfferResponse extends PaginationResponse<GetOfferResponse> {}
