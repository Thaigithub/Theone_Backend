import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';
export class AuthMemberUserIdRequest {
    @Expose()
    @IsString()
    public name: string;
    @Expose()
    @IsString()
    public phoneNumber: string;
}
