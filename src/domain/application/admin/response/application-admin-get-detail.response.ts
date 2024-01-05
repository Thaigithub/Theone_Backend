import { ContractStatus, Interview, Member, Post, PostApplicationStatus } from '@prisma/client';

export class ApplicationAdminGetDetailResponse {
    status: PostApplicationStatus;
    name: string;
    isTeam: boolean;
    contact: Member['contact'];
    leaderName: Member['name'];
    contractStatus: ContractStatus;
    startDate: Post['startDate'];
    endDate: Post['endDate'];
    interviewRequestDate: Interview['interviewRequestDate'];
}
