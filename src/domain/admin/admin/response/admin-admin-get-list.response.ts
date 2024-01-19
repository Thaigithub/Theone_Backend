import { Admin } from '@prisma/client';
import { PaginationResponse } from 'utils/generics/pagination.response';
class AdminAdminGetResponse {
    id: Admin['id'];
    name: Admin['name'];
    level: Admin['level'];
}
export class AdminAdminGetListResponse extends PaginationResponse<AdminAdminGetResponse> {}
