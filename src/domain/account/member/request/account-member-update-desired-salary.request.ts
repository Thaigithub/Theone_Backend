import { Expose } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class AccountMemberUpdateDesiredSalaryRequest {
    @IsNumber()
    @Expose()
    desiredSalary: number;
}
