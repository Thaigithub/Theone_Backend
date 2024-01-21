import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class MemberMemberGetOneRequest {
    @Expose()
    @IsString()
    username: string;

    @Expose()
    @IsString()
    contact: string;
}
