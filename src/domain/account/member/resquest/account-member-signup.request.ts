import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsOptional, IsString, Matches } from 'class-validator';

export class MemberAccountSignupRequest {
    @Expose()
    @IsString()
    @Matches(/^[a-z0-9]+$/, {
        message: 'The "ID" field must contain only lowercase letters or lowercase letters with numbers.',
    })
    @ApiProperty({
        description: 'The "ID" field must contain only lowercase letters or lowercase letters with numbers.',
        type: String,
        example: 'usernamesss',
    })
    username: string;

    @Expose()
    @IsString()
    @ApiProperty({
        description: 'Password containing 6 to 20 characters including letters and numbers. Special characters are optional.',
        type: String,
        example: 'password123',
    })
    @Matches(/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d!@#$%^&*()\-_=+{}\[\];:'",.<>/?]{6,20}$/, {
        message:
            'The "password" field must be 6 to 20 characters, including English letters and numbers. Special characters are optional.',
    })
    password: string;

    @Expose()
    @ApiProperty({
        description: 'Name of the user',
        type: String,
        example: 'John Doe',
    })
    @IsString()
    readonly name: string;

    @IsString()
    @ApiProperty({
        description: 'Optional recommender ID',
        type: String,
        example: 'recommender123',
        required: false,
    })
    @Expose()
    @IsOptional()
    readonly recommenderId?: string;
}
