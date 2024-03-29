import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class AuthMemberLoginSocialRequest {
    @Expose()
    @IsString()
    idToken: string;
}
