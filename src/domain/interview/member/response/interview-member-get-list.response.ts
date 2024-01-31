import { Application, Code, Post, Site } from '@prisma/client';
import { FileResponse } from 'utils/generics/file.response';
import { PaginationResponse } from 'utils/generics/pagination.response';

class InterviewMemberGetResponse {
    companyLogo: FileResponse;
    postId: Post['id'];
    postName: Post['name'];
    postStatus: Post['status'];
    siteAddress: Site['address'];
    occupationId: Post['codeId'];
    occupationName: Code['name'];
    siteName: Site['name'];
    endDate: Post['endDate'];
    status: Application['status'];
    appliedDate: Application['assignedAt'];
    applicationId: Application['id'];
    isInterested: boolean;
}

export class InterviewMemberGetListResponse extends PaginationResponse<InterviewMemberGetResponse> {}
