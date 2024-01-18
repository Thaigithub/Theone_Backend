import { Interview, Member, Post, PostApplicationStatus } from '@prisma/client';
import { ApplicationAdminContractStatus } from '../enum/application-admin-contract-status.enum';

export class ApplicationAdminGetDetailResponse {
    status: PostApplicationStatus;
    name: string;
    isTeam: boolean;
    contact: Member['contact'];
    leaderName: Member['name'];
    contractStatus: ApplicationAdminContractStatus;
    startDate: Post['startDate'];
    endDate: Post['endDate'];
    interviewRequestDate: Interview['requestDate'];
}
