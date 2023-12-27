import { PaginationResponse } from 'utils/generics/pagination.response';

export class GetListOfferByPost {
    applicationId: number;
    member: {
        name: string;
        contact: string;
    };
    team: {
        name: string;
        contact: string;
    };
}
export class ApplicationCompanyGetListOfferByPost extends PaginationResponse<GetListOfferByPost> {}
