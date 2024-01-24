import { Expose } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';

export class PreferenceMemberUpdateRequest {
    @Expose()
    @IsBoolean()
    @IsOptional()
    isPushNotificationActive: boolean;

    @Expose()
    @IsBoolean()
    @IsOptional()
    isNotificationSoundActive: boolean;

    @Expose()
    @IsBoolean()
    @IsOptional()
    isNoticeNotificationActive: boolean;

    @Expose()
    @IsBoolean()
    @IsOptional()
    isServiceNotificationActive: boolean;

    @Expose()
    @IsBoolean()
    @IsOptional()
    isTeamNotificationActive: boolean;

    @Expose()
    @IsBoolean()
    @IsOptional()
    isSearchByMemberLocationAllowed: boolean;

    @Expose()
    @IsBoolean()
    @IsOptional()
    isMemberLocationSearchedBySitesAllowed: boolean;
}
