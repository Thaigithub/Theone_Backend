import { Expose } from 'class-transformer';
import { ArrayUnique, IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class AccountMemberUpdateRequest {
    @IsString()
    @IsOptional()
    @Expose()
    name: string;

    @IsNumber()
    @IsOptional()
    @Expose()
    desiredSalary: number;

    @IsArray()
    @ArrayUnique()
    @IsNumber({}, { each: true })
    @IsOptional()
    @Expose()
    desiredOccupations: number[];
}
