import { Post, PostStatus } from '@prisma/client';
import { PaginationResponse } from 'utils/generics/pagination.response';
import { PostCompanyGetListHeadhuntingRequestDTO } from '../dto/post-company-get-list-headhunting-request.dto';
import { PostCompanyGetItemListSiteResponse } from './post-company-get-item-list.response';

export class PostCompanyGetItemHeadhuntingRequestResponse {
    name: string;
    status: PostStatus;
    startDate: Post['startDate'];
    endDate: Post['endDate'];
    site: PostCompanyGetItemListSiteResponse;
    headhuntingRequest: PostCompanyGetListHeadhuntingRequestDTO;
}

export class PostCompanyGetListHeadhuntingRequestResponse extends PaginationResponse<PostCompanyGetItemHeadhuntingRequestResponse> {}
