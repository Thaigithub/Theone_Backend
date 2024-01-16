import { MemberPreference } from '@prisma/client';

export class PreferenceMemberGetDetailResponse {
    id: MemberPreference['id'];
    isPushNotificationActive: MemberPreference['isPushNotificationActive'];
    isNotificationSoundActive: MemberPreference['isNotificationSoundActive'];
    isNoticeNotificationActive: MemberPreference['isNoticeNotificationActive'];
    isServiceNotificationActive: MemberPreference['isServiceNotificationActive'];
    isTeamNotificationActive: MemberPreference['isTeamNotificationActive'];
    isSearchByMemberLocationAllowed: MemberPreference['isSearchByMemberLocationAllowed'];
    isMemberLocationSearchedBySitesAllowed: MemberPreference['isMemberLocationSearchedBySitesAllowed'];
}
