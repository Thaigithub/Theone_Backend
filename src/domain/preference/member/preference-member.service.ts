import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'services/prisma/prisma.service';
import { PreferenceMemberUpdateRequest } from './request/preference-member-update.request';
import { PreferenceMemberGetDetailResponse } from './response/preference-member-get-preference.response';

@Injectable()
export class PreferenceMemberService {
    constructor(private prismaService: PrismaService) {}

    async getDetail(accountId: number): Promise<PreferenceMemberGetDetailResponse> {
        const preference = await this.prismaService.preference.findFirst({
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

    async update(accountId: number, body: PreferenceMemberUpdateRequest): Promise<void> {
        await this.prismaService.preference.updateMany({
            where: {
                member: {
                    accountId,
                },
            },
            data: {
                isPushNotificationActive: body.isPushNotificationActive,
                isNotificationSoundActive: body.isNotificationSoundActive,
                isNoticeNotificationActive: body.isNoticeNotificationActive,
                isServiceNotificationActive: body.isServiceNotificationActive,
                isTeamNotificationActive: body.isTeamNotificationActive,
                isSearchByMemberLocationAllowed: body.isSearchByMemberLocationAllowed,
                isMemberLocationSearchedBySitesAllowed: body.isMemberLocationSearchedBySitesAllowed,
            },
        });
    }
}
