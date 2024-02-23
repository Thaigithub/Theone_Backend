import { Expose } from 'class-transformer';
import { IsEmail, IsNumber, IsOptional, IsString } from 'class-validator';

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

    @IsString()
    @IsEmail()
    @IsOptional()
    @Expose()
    email: string;
}
