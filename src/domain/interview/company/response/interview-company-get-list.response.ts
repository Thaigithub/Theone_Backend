import { PaginationResponse } from 'utils/generics/pageInfo.response';
import { InterviewCompanyGetItemResponse } from './interview-company-get-item.response';

export class InterviewCompanyGetListResponse extends PaginationResponse<InterviewCompanyGetItemResponse> {}
