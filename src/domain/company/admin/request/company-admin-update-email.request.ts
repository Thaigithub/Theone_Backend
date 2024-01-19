import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class CompanyAdminUpdateEmailRequest {
    @Expose()
    @IsString()
    email: string;
}
