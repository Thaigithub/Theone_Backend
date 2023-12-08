import { Team } from '@prisma/client';

export class MemberTeamsResponse {
    id: Team['id'];
    name: Team['name'];
    code: Team['code'];
    isActive: Team['isActive'];
    leaderName: string;
    status: Team['status'];
    exposureStatus: Team['exposureStatus'];
    createdAt: Team['createdAt'];
    numberOfRecruitments: Team['numberOfRecruiments'];
    members: number;
}
