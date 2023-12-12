import { ApiProperty } from '@nestjs/swagger';
import { CompanyType, FileType } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsDateString, IsEnum, IsNumber, IsNumberString, IsString, Matches, Max, MaxLength, Min } from 'class-validator';

class File {
    @Expose()
    @IsString()
    @ApiProperty({
        description: 'File key',
        example: '2g3f34rgf',
    })
    readonly key: string;

    @Expose()
    @IsString()
    @ApiProperty({
        description: 'File name',
        example: 'fsdvsd.pdf',
    })
    readonly name: string;

    @Expose()
    @IsEnum(FileType)
    @ApiProperty({
        type: 'enum',
        enum: FileType,
        description: 'File type',
        example: 'PDF',
    })
    readonly type: FileType;

    @Expose()
    @IsNumber()
    @ApiProperty({
        description: 'File size',
        example: '23442',
    })
    readonly size: number;
}

export class AccountCompanySignupRequest {
    @Expose()
    @IsString()
    @Matches(/^[a-z0-9]+$/, {
        message: 'The "ID" field must contain only lowercase letters or lowercase letters with numbers.',
    })
    @ApiProperty({
        description: 'The "ID" field must contain only lowercase letters or lowercase letters with numbers.',
        example: 'username',
    })
    @MaxLength(20)
    username: string;

    @Expose()
    @IsString()
    @ApiProperty({
        description: 'Password containing 6 to 20 characters including letters and numbers. Special characters are optional.',
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
        example: 'The One',
    })
    @IsString()
    @MaxLength(50)
    readonly name: string;

    @Expose()
    @IsDateString()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'The property must be in the format yyyy-mm-dd.',
    })
    @ApiProperty({
        description: 'Establishment date',
        example: '2023-05-10',
    })
    readonly estDate: string;

    @Expose()
    @ApiProperty({
        description: 'Business Registration Number',
        example: '1111111111',
    })
    @IsString()
    @MaxLength(10)
    readonly businessRegNum: string;

    @Expose()
    @ApiProperty({
        description: 'Business Registration Number',
        example: '1111111111111',
    })
    @IsString()
    @MaxLength(13)
    readonly corporateRegNum: string;

    @Expose()
    @ApiProperty({
        description: 'Name of the presentative',
        example: 'The One',
    })
    @IsString()
    @MaxLength(50)
    readonly presentativeName: string;

    @Expose()
    @ApiProperty({
        description: 'Adress',
        example: 'The One',
    })
    @IsString()
    readonly address: string;

    @Expose()
    @ApiProperty({
        description: 'Logitude of the company',
        example: 0.0,
    })
    @IsNumber()
    @Min(-180)
    @Max(180)
    readonly longitude: number;

    @Expose()
    @ApiProperty({
        description: 'Latitude of the company',
        example: 0.0,
    })
    @IsNumber()
    @Min(-90)
    @Max(90)
    readonly latitude: number;

    @Expose()
    @ApiProperty({
        description: 'Email',
        example: 'theone@gmail.com',
    })
    @IsString()
    @MaxLength(100)
    readonly email: string;

    @Expose()
    @ApiProperty({
        description: 'Contact person name',
        example: 'The One',
    })
    @IsString()
    @MaxLength(100)
    readonly contactName: string;

    @Expose()
    @ApiProperty({
        description: 'Contact person phone',
        example: '82000000000',
    })
    @IsNumberString()
    @MaxLength(11)
    readonly contactPhone: string;

    @Expose()
    @ApiProperty({
        description: 'Company phone',
        example: '82000000000',
    })
    @IsNumberString()
    @MaxLength(11)
    readonly phone: string;

    @Expose()
    @ApiProperty({
        description: 'Company Type',
        example: 'CORPORATION',
    })
    @IsEnum(CompanyType)
    readonly type: CompanyType;

    @Expose()
    @ApiProperty({
        description: 'Company Logo',
    })
    readonly logo: File;

    @Expose()
    @ApiProperty({
        description: 'Company Logo',
    })
    readonly contactCard: File;
}
