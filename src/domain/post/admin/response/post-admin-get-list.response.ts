import { Post } from '@prisma/client';
import { PaginationResponse } from 'utils/generics/pagination.response';
import { PostAdminSiteResponseDTO } from '../dto/post-admin-site-response.dto';

export class GetListResponse {
    name: Post['name'];
    type: Post['type'];
    isHidden: Post['isHidden'];
    site: PostAdminSiteResponseDTO;
    status: Post['status'];
    isPulledUp: Post['isPulledUp'];
}

export class PostAdminGetListResponse extends PaginationResponse<GetListResponse> {}
