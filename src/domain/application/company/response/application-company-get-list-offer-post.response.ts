import { PaginationResponse } from 'utils/generics/pagination.response';

export class GetListOfferPost {
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
export class ApplicationCompanyGetListOfferPost extends PaginationResponse<GetListOfferPost> {}
