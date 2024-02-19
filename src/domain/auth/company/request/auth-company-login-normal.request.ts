import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';
import { DeviceTokenRequest } from 'utils/generics/device-token.request';

export class AuthCompanyLoginRequest extends DeviceTokenRequest {
    @Expose()
    @IsString()
    username: string;

    @Expose()
    @IsString()
    password: string;
}
