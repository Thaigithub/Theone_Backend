import { PaginationResponse } from 'utils/generics/pageInfo.response';
import { PostCompanyGetItemApplicantsResponse } from './post-company-get-item-applicants.response';

export class PostCompanyGetListApplicantsResponse extends PaginationResponse<PostCompanyGetItemApplicantsResponse> {}
