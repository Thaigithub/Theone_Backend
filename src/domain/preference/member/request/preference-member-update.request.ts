import { Expose } from 'class-transformer';
import { IsBoolean } from 'class-validator';

export class PreferenceMemberUpdateRequest {
    @Expose()
    @IsBoolean()
    isPushNotificationActive: boolean;

    @Expose()
    @IsBoolean()
    isNotificationSoundActive: boolean;

    @Expose()
    @IsBoolean()
    isNoticeNotificationActive: boolean;

    @Expose()
    @IsBoolean()
    isServiceNotificationActive: boolean;

    @Expose()
    @IsBoolean()
    isTeamNotificationActive: boolean;

    @Expose()
    @IsBoolean()
    isSearchByMemberLocationAllowed: boolean;

    @Expose()
    @IsBoolean()
    isMemberLocationSearchedBySitesAllowed: boolean;
}
