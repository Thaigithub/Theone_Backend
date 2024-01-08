import { Expose } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class AccountMemberUpdateRequest {
    @IsString()
    @IsOptional()
    @Expose()
    name: string;

    @IsNumber()
    @IsOptional()
    @Expose()
    desiredSalary: number;

    @IsNumber()
    @IsOptional()
    @Expose()
    occupation: number;
}
