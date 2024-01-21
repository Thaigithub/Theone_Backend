import { InvitationStatus } from '@prisma/client';

export class TeamMemberGetDetailResponse {
    team: {
        name: string;
        city: {
            id: number;
            englishName: string;
            koreanName: string;
        };
        district: {
            id: number;
            englishName: string;
            koreanName: string;
        };
        introduction: string;
        createdAt: Date;
        code: {
            id: number;
            codeName: string;
            code: string;
        };
        leaderName: string;
        leaderContact: string;
    };
    members: {
        id: number;
        name: string;
        contact: string;
    }[];
    memberInvitations: {
        id: number;
        memberId: number;
        name: string;
        contact: string;
        invitationStatus: InvitationStatus;
    }[];
}
