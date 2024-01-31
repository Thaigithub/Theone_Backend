import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class AccountMemberUpdateUsernameRequest {
    @IsString()
    @Expose()
    username: string;
}
