import { ApiProperty } from '@nestjs/swagger';
import { Code, Member } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class AccountMemberUpdateInfoMyHomeRequest {
    @ApiProperty({
        type: 'number',
        required: false,
    })
    @IsNumber()
    @IsOptional()
    @Expose()
    public desiredSalary: Member['desiredSalary'];

    @ApiProperty({
        type: 'number',
        required: false,
    })
    @IsNumber()
    @IsOptional()
    @Expose()
    public occupation: Code['id'];
}
