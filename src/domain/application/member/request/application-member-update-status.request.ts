import { IsEnum } from 'class-validator';
import { ChangeApplicationStatus } from '../enum/application-member-change-status.enum';
import { Expose } from 'class-transformer';

export class ApplicationMemberUpdateStatusRequest {
    @Expose()
    @IsEnum(ChangeApplicationStatus)
    status: ChangeApplicationStatus;
}
