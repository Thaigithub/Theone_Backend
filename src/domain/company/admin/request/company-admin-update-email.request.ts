import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class AdminCompanyUpdateEmailRequest {
    @Expose()
    @IsString()
    email: string;
}
