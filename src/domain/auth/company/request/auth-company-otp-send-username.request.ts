import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';
export class AuthCompanyUserIdRequest {
    @Expose()
    @IsString()
    name: string;
    @Expose()
    @IsString()
    phoneNumber: string;
}
