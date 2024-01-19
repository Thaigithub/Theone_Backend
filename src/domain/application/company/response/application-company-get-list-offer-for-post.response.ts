import { PaginationResponse } from 'utils/generics/pagination.response';

export class GetListOfferForPost {
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
export class ApplicationCompanyGetListOfferForPost extends PaginationResponse<GetListOfferForPost> {}
