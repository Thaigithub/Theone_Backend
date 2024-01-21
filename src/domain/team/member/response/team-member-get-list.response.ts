import { Team } from '@prisma/client';
import { PaginationResponse } from 'utils/generics/pagination.response';

export class GetListResponse {
    name: Team['name'];
    code: {
        id: number;
        codeName: string;
        code: string;
    };
    isActive: Team['isActive'];
    isLeader: boolean;
    leaderName: string;
    status: Team['status'];
    exposureStatus: Team['exposureStatus'];
    createdAt: Team['createdAt'];
    numberOfRecruitments: Team['numberOfRecruitments'];
    totalMembers: number;
    memberInfors: {
        id: number;
        name: string;
        contact: string;
    }[];
}
export class TeamMemberGetListResponse extends PaginationResponse<GetListResponse> {}
