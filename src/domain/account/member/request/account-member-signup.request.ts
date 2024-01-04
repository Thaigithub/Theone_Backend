import { Expose } from 'class-transformer';
import { IsOptional, IsString, Matches, MaxLength } from 'class-validator';

export class AccountMemberSignupRequest {
    @Expose()
    @IsString()
    @Matches(/^[a-z0-9]+$/, {
        message: 'The "ID" field must contain only lowercase letters or lowercase letters with numbers.',
    })
    @MaxLength(20)
    username: string;

    @Expose()
    @IsString()
    @Matches(/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d!@#$%^&*()\-_=+{}\[\];:'",.<>/?]{6,20}$/, {
        message:
            'The "password" field must be 6 to 20 characters, including English letters and numbers. Special characters are optional.',
    })
    password: string;

    @Expose()
    @IsString()
    name: string;

    @IsString()
    @Expose()
    @IsOptional()
    recommenderId?: string;
}
