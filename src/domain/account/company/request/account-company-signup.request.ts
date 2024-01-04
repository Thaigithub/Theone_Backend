import { CompanyType } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsEmail, IsEnum, IsNumberString, IsString, Matches, MaxLength } from 'class-validator';
import { FileRequest } from 'utils/generics/file.request';

export class AccountCompanySignupRequest {
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
    @MaxLength(50)
    name: string;

    @Expose()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'The property must be in the format yyyy-mm-dd.',
    })
    estDate: string;

    @Expose()
    @IsString()
    @MaxLength(10)
    businessRegNum: string;

    @Expose()
    @IsString()
    @MaxLength(13)
    corporateRegNum: string;

    @Expose()
    @IsString()
    @MaxLength(50)
    presentativeName: string;

    @Expose()
    @IsString()
    address: string;

    @Expose()
    @IsEmail()
    @MaxLength(100)
    email: string;

    @Expose()
    @IsString()
    @MaxLength(100)
    contactName: string;

    @Expose()
    @IsNumberString()
    @MaxLength(11)
    contactPhone: string;

    @Expose()
    @IsNumberString()
    @MaxLength(11)
    phone: string;

    @Expose()
    @IsEnum(CompanyType)
    type: CompanyType;

    @Expose()
    logo: FileRequest;

    @Expose()
    contactCard: FileRequest;
}
