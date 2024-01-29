import { Member, Point } from '@prisma/client';
import { FileResponse } from 'utils/generics/file.response';
import { PaginationResponse } from 'utils/generics/pagination.response';

class PointAdminGetResponse {
    id: Point['id'];
    name: Member['name'];
    contact: Member['contact'];
    completeDate: Point['updateAt'];
    status: Point['status'];
    file: FileResponse;
}

export class PointAdminGetListResponse extends PaginationResponse<PointAdminGetResponse> {}
