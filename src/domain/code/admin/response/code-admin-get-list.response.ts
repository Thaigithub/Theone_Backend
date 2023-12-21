import { PaginationResponse } from 'utils/generics/pageInfo.response';
import { CodeAdminGetItemResponse } from './code-admin-get-item.response';

export class CodeAdminGetListResponse extends PaginationResponse<CodeAdminGetItemResponse> {}
