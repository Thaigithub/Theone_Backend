import { Code } from '@prisma/client';
import { PaginationResponse } from 'utils/generics/pagination.response';

class GetListResponse {
    id: Code['id'];
    codeName: Code['name'];
}
export class CodeMemberGetListResponse extends PaginationResponse<GetListResponse> {}
