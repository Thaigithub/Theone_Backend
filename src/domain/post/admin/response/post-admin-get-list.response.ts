import { ApiProperty } from '@nestjs/swagger';
import { Post } from '@prisma/client';
import { PaginationResponse } from 'utils/generics/pagination.response';

export class PostAdminSiteResponse {
    @ApiProperty({ example: 'string' })
    name: string;

    @ApiProperty({ example: 'string' })
    contact: string;

    @ApiProperty({ example: 'string' })
    personInCharge: string;

    @ApiProperty({ example: 'string' })
    originalBuilding: string;

    @ApiProperty({ type: 'string', example: '101-dong, 42 Seolleung-ro 90-gil, Gangnam-gu, Seoul' })
    address: string;
}
export class PostAdminResponse {
    name: Post['name'];
    type: Post['type'];
    isHidden: Post['isHidden'];
    site: PostAdminSiteResponse;
    status: Post['status'];
    isPulledUp: Post['isPulledUp'];
}

export class ApplicationAdminSiteResponse {
    name: string;
}
export class ApplicationAdminResponse {
    site: ApplicationAdminSiteResponse;
    name: Post['name'];
    countApplication: number;
    startDate: Post['startDate'];
    status: Post['status'];
}

export class PostAdminGetListResponse extends PaginationResponse<PostAdminResponse> {}
export class ApplicationAdminGetListResponse extends PaginationResponse<ApplicationAdminResponse> {}
