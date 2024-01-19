import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class TeamGetMemberRequest {
    @Expose()
    @IsString()
    username: string;

    @Expose()
    @IsString()
    contact: string;
}
