import { Expose } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class AccountMemberUpdateRequest {
    @IsNumber()
    @IsOptional()
    @Expose()
    desiredSalary: number;

    @IsNumber()
    @IsOptional()
    @Expose()
    occupation: number;
}
