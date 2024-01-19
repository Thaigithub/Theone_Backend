import { SignupMethodType } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class AccountMemberSignupSnsRequest {
    @Expose()
    @IsEnum(SignupMethodType)
    signupMethod: SignupMethodType;

    @Expose()
    @IsString()
    idToken: string;

    @Expose()
    @IsOptional()
    @IsString()
    recommenderId: string;
}
