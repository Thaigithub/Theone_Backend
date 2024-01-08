import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';
export class AuthMemberUserIdRequest {
    @Expose()
    @IsString()
    name: string;
    @Expose()
    @IsString()
    phoneNumber: string;
}
