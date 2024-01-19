import { PaginationResponse } from 'utils/generics/pagination.response';
import { CodeAdminGetDetailResponse } from './code-admin-get-detail.response';

export class CodeAdminGetListResponse extends PaginationResponse<CodeAdminGetDetailResponse> {}
