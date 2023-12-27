import { ApiProperty } from '@nestjs/swagger';
import { Application, Code, Post, PostApplicationStatus, PostStatus, Site } from '@prisma/client';
import { PaginationResponse } from 'utils/generics/pagination.response';
import { FileClass } from '../dto/application-member-filetype.response.dto';

class ApplicationMemberGetResponse {
    @ApiProperty({ type: FileClass })
    companyLogo: FileClass;
    @ApiProperty({ type: Number })
    postId: Post['id'];
    @ApiProperty({ type: String })
    postName: Post['name'];
    @ApiProperty({ type: 'enum', enum: PostStatus })
    postStatus: Post['status'];
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
    @ApiProperty({ type: Number })
    applicationId: Application['id'];
    @ApiProperty({ type: Boolean })
    isInterested: boolean;
}

export class ApplicationMemberGetListResponse extends PaginationResponse<ApplicationMemberGetResponse> {}
