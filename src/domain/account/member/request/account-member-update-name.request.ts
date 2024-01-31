import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class AccountMemberUpdateNameRequest {
    @IsString()
    @Expose()
    name: string;
}
