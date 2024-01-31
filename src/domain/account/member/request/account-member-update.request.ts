import { Expose } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class AccountMemberUpdateRequest {
    @IsString()
    @Expose()
    username: string;

    @IsString()
    @Expose()
    name: string;

    @IsNumber()
    @Expose()
    desiredSalary: number;

    @IsNumber()
    @Expose()
    regionId: number;
}
