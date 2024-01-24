import { Preference } from '@prisma/client';

export class PreferenceMemberGetDetailResponse {
    id: Preference['id'];
    isPushNotificationActive: Preference['isPushNotificationActive'];
    isNotificationSoundActive: Preference['isNotificationSoundActive'];
    isNoticeNotificationActive: Preference['isNoticeNotificationActive'];
    isServiceNotificationActive: Preference['isServiceNotificationActive'];
    isTeamNotificationActive: Preference['isTeamNotificationActive'];
    isSearchByMemberLocationAllowed: Preference['isSearchByMemberLocationAllowed'];
    isMemberLocationSearchedBySitesAllowed: Preference['isMemberLocationSearchedBySitesAllowed'];
}
