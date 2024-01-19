import { Expose } from 'class-transformer';
import { IsEnum } from 'class-validator';
import { ApplicationCompanyStatus } from '../enum/application-company-update-status.enum';

export class ApplicationCompanyUpdateStatusRequest {
    @Expose()
    @IsEnum(ApplicationCompanyStatus)
    status: ApplicationCompanyStatus;
}
