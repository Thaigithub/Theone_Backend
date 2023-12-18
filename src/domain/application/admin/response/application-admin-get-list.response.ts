import { ApiProperty } from '@nestjs/swagger';
import { Post, PostStatus } from '@prisma/client';
import { PaginationResponse } from 'utils/generics/pageInfo.response';
// import { ApplicationAdminStatusFilter } from '../dto/application-admin-filter';

export class ApplicationAdminSiteResponse {
    @ApiProperty({ type: 'string' })
    name: string;
}
export class ApplicationAdminResponse {
    @ApiProperty({ type: ApplicationAdminSiteResponse })
    site: ApplicationAdminSiteResponse;

    @ApiProperty({ type: 'string' })
    public name: Post['name'];

    @ApiProperty({ type: Number })
    public countApplication: number;

    @ApiProperty({ type: Date })
    public startDate: Post['startDate'];

    @ApiProperty({ type: 'enum', enum: PostStatus })
    public status: Post['status'];
}

export class ApplicationAdminGetListResponse extends PaginationResponse<ApplicationAdminResponse> {}
