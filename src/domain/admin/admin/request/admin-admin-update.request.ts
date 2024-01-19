import { Expose } from 'class-transformer';
import { IsLowercase, IsNotEmpty, IsOptional, IsString, Length, Matches } from 'class-validator';

export abstract class AdminAdminUpdateRequest {
    @Expose()
    @IsString()
    @Length(1, 20, { message: 'ID should be between 1 and 20 characters' })
    @Matches(/^[a-z][a-z0-9]{0,19}$/, {
        message: 'ID should start with a lowercase English letter and can contain lowercase letters and numbers only',
    })
    @IsLowercase({ message: 'ID should be in lowercase' })
    @IsNotEmpty({ message: 'ID is required' })
    username: string;

    @Expose()
    @IsString({ message: 'Password must be a string' })
    @Length(6, 20, { message: 'Password should be between 6 and 20 characters' })
    @Matches(/^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]*$/, {
        message: 'Password should contain a combination of English letters and numbers with optional special characters',
        each: true,
    })
    @IsOptional()
    password: string;
}
