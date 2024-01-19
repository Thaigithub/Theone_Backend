import { Post } from '@prisma/client';
import { PaginationResponse } from 'utils/generics/pagination.response';

export class GetListForApplicationResponse {
    site: {
        name: string;
    };
    name: Post['name'];
    countApplication: number;
    startDate: Post['startDate'];
    status: Post['status'];
}

export class PostAdminGetListForApplicationResponse extends PaginationResponse<GetListForApplicationResponse> {}
