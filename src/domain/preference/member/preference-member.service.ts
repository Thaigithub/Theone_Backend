import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'services/prisma/prisma.service';
import { PreferenceMemberGetDetailResponse } from './response/preference-member-get-preference.response';

@Injectable()
export class PreferenceMemberService {
    constructor(private readonly prismaService: PrismaService) {}

    async getDetail(accountId: number): Promise<PreferenceMemberGetDetailResponse> {
        const preference = await this.prismaService.memberPreference.findFirst({
            select: {
                id: true,
                isPushNotificationActive: true,
                isNotificationSoundActive: true,
                isNoticeNotificationActive: true,
                isServiceNotificationActive: true,
                isTeamNotificationActive: true,
                isSearchByMemberLocationAllowed: true,
                isMemberLocationSearchedBySitesAllowed: true,
            },
            where: {
                isActive: true,
                member: {
                    accountId,
                },
            },
        });

        if (!preference) throw new NotFoundException('Preference not found');

        return {
            id: preference.id,
            isPushNotificationActive: preference.isPushNotificationActive,
            isNotificationSoundActive: preference.isNotificationSoundActive,
            isNoticeNotificationActive: preference.isNoticeNotificationActive,
            isServiceNotificationActive: preference.isServiceNotificationActive,
            isTeamNotificationActive: preference.isTeamNotificationActive,
            isSearchByMemberLocationAllowed: preference.isSearchByMemberLocationAllowed,
            isMemberLocationSearchedBySitesAllowed: preference.isMemberLocationSearchedBySitesAllowed,
        };
    }
}