import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class AuthAdminLoginRequest {
    @Expose()
    @IsString()
    username: string;

    @Expose()
    @IsString()
    password: string;
}
