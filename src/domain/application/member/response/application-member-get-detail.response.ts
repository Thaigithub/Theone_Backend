import { Application, Company, Post, Site } from '@prisma/client';
import { FileResponse } from 'utils/generics/file.response';
import { Member, Team } from '../dto/application-member-team-type-response.dto';

export class ApplicationMemberGetDetailResponse {
    isLeader: boolean;
    companyName: Company['name'];
    companyId: Company['id'];
    companyLogo: FileResponse;
    postId: Post['id'];
    postName: Post['name'];
    postStatus: Post['status'];
    siteAddress: Site['address'];
    siteStartDate: Site['startDate'];
    siteEndDate: Site['endDate'];
    siteName: Site['name'];
    sitePersonInCharge: Site['personInCharge'];
    sitePersonInChargeContact: Site['personInChargeContact'];
    siteEmail: Site['email'];
    postEndDate: Post['endDate'];
    postStartDate: Post['startDate'];
    status: Application['status'];
    appliedDate: Application['assignedAt'];
    occupationName: string;
    isInterested: boolean;
    team: Team;
    member: Member;
}
