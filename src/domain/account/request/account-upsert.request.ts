import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsLowercase, IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export abstract class AccountUpsertRequest {
    @Expose()
    @IsString()
    @ApiProperty({ example: 'abc' })
    @Length(1, 20, { message: 'ID should be between 1 and 20 characters' })
    @Matches(/^[a-z][a-z0-9]{0,19}$/, {
        message: 'ID should start with a lowercase English letter and can contain lowercase letters and numbers only',
    })
    @IsLowercase({ message: 'ID should be in lowercase' })
    @IsNotEmpty({ message: 'ID is required' })
    public username: string;

    @Expose()
    @ApiProperty({ example: '***' })
    @IsString({ message: 'Password must be a string' })
    @Length(6, 20, { message: 'Password should be between 6 and 20 characters' })
    @Matches(/^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]*$/, {
        message: 'Password should contain a combination of English letters and numbers with optional special characters',
        each: true,
    })
    @IsNotEmpty({ message: 'Password is required' })
    public password: string;
}
