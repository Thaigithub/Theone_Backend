import { Expose } from 'class-transformer';
import { IsEnum } from 'class-validator';
import { ApplicationMemberUpdateStatus } from '../enum/application-member-update-status.enum';

export class ApplicationMemberUpdateStatusRequest {
    @Expose()
    @IsEnum(ApplicationMemberUpdateStatus)
    status: ApplicationMemberUpdateStatus;
}
