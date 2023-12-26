import { SignupMethodType } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class MemberAccountSignupSnsRequest {
    @Expose()
    @IsEnum(SignupMethodType)
    readonly signupMethod: SignupMethodType;

    @Expose()
    @IsString()
    readonly idToken: string;

    @Expose()
    @IsOptional()
    readonly recommenderId?: string;
}
