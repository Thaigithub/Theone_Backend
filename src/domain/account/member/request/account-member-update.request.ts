import { Expose } from 'class-transformer';
import { IsString, IsNumber, IsOptional } from 'class-validator';

export class AccountMemberUpdateRequest {
    @IsString()
    @IsOptional()
    @Expose()
    username: string;

    @IsNumber()
    @IsOptional()
    @Expose()
    desiredSalary: number;

    @IsNumber()
    @IsOptional()
    @Expose()
    districtId: number;
}
