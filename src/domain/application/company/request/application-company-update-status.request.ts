import { Expose } from 'class-transformer';
import { IsEnum } from 'class-validator';
import { ApplicationCompanyUpdateStatus } from '../enum/application-company-update-status.enum';

export class ApplicationCompanyUpdateStatusRequest {
    @Expose()
    @IsEnum(ApplicationCompanyUpdateStatus)
    status: ApplicationCompanyUpdateStatus;
}
