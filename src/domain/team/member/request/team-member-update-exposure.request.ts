import { Expose } from 'class-transformer';
import { IsBoolean } from 'class-validator';

export class TeamMemberUpdateExposureRequest {
    @Expose()
    @IsBoolean()
    exposureStatus: boolean;
}
