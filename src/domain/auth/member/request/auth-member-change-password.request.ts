import { Expose } from 'class-transformer';
import { IsNumber, IsString, Matches } from 'class-validator';

export class AuthMemberChangePasswordRequest {
    @Expose()
    @IsString()
    @Matches(/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d!@#$%^&*()\-_=+{}\[\];:'",.<>/?]{6,20}$/, {
        message:
            'The "password" field must be 6 to 20 characters, including English letters and numbers. Special characters are optional.',
    })
    password: string;

    @Expose()
    @IsNumber()
    otpId: number;
}
