import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class AuthMemberLoginRequest {
    @Expose()
    @IsString()
    public username: string;

    @Expose()
    @IsString()
    public password: string;
}
