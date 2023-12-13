import { ApiProperty } from '@nestjs/swagger';
import { Application, Code, Post, PostApplicationStatus, PostStatus, Site } from '@prisma/client';
import { PaginationResponse } from 'utils/generics/pageInfo.response';
import { FileClass } from '../dto/application-admin-filetype.response.dto';

class ApplicationMemberGetResponse {
    @ApiProperty({ type: FileClass })
    companyLogo: FileClass;
    @ApiProperty({ type: Number })
    postId: Post['id'];
    @ApiProperty({ type: String })
    postName: Post['name'];
    @ApiProperty({ type: 'enum', enum: PostStatus })
    postStatus: Post['status'];
    @ApiProperty({ type: Number })
    siteId: Site['id'];
    @ApiProperty({ type: String })
    siteAddress: Site['address'];
    @ApiProperty({ type: Number })
    occupationId: Post['occupationId'];
    @ApiProperty({ type: String })
    occupationName: Code['codeName'];
    @ApiProperty({ type: String })
    siteName: Site['name'];
    @ApiProperty({ type: Date })
    endDate: Post['endDate'];
    @ApiProperty({ type: 'enum', enum: PostApplicationStatus })
    status: Application['status'];
    @ApiProperty({ type: Date })
    appliedDate: Application['assignedAt'];
}

export class ApplicationMemberGetListResponse extends PaginationResponse<ApplicationMemberGetResponse> {}
