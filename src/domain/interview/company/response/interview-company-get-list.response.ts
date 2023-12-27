import { PaginationResponse } from 'utils/generics/pagination.response';
import { InterviewCompanyGetItemResponse } from './interview-company-get-item.response';

export class InterviewCompanyGetListResponse extends PaginationResponse<InterviewCompanyGetItemResponse> {}
