import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';
export class AuthCompanyUserIdRequest {
    @Expose()
    @IsString()
    public name: string;
    @Expose()
    @IsString()
    public email: string;
}
