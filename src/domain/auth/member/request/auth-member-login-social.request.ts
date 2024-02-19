import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';
import { DeviceTokenRequest } from 'utils/generics/device-token.request';

export class AuthMemberLoginSocialRequest extends DeviceTokenRequest {
    @Expose()
    @IsString()
    idToken: string;
}
