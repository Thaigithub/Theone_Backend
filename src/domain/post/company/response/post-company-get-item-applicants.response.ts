import { PostCompanyGetItemListResponse } from './post-company-get-item-list.response';

export class PostCompanyGetItemApplicantsResponse extends PostCompanyGetItemListResponse {
    teamCount: number;
    memberCount: number;
}
