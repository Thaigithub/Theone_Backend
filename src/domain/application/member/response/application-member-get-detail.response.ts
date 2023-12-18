import { ApiProperty } from '@nestjs/swagger';
import { Application, Company, Post, PostApplicationStatus, PostStatus, Site } from '@prisma/client';
import { FileClass } from '../dto/application-admin-filetype.response.dto';

export class ApplicationMemberGetDetailResponse {
    @ApiProperty({ type: String })
    companyName: Company['name'];
    @ApiProperty({ type: Number })
    companyId: Company['id'];
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
    @ApiProperty({ type: Date })
    siteStartDate: Site['startDate'];
    @ApiProperty({ type: Date })
    siteEndDate: Site['endDate'];
    @ApiProperty({ type: String })
    siteName: Site['name'];
    @ApiProperty({ type: Date })
    postEndDate: Post['endDate'];
    @ApiProperty({ type: Date })
    postStartDate: Post['startDate'];
    @ApiProperty({ type: 'enum', enum: PostApplicationStatus })
    status: Application['status'];
    @ApiProperty({ type: Date })
    appliedDate: Application['assignedAt'];
}
