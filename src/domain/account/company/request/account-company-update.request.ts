import { CompanyType } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsArray, IsDateString, IsEnum, IsNotEmptyObject, IsNumberString, IsString, Matches, MaxLength } from 'class-validator';
import { FileRequest } from 'utils/generics/file.request';

export class AccountCompanyUpdateRequest {
    @Expose()
    @IsString()
    @Matches(/^[a-z0-9]+$/, {
        message: 'The "ID" field must contain only lowercase letters or lowercase letters with numbers.',
    })
    @MaxLength(20)
    username: string;

    @Expose()
    @IsString()
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
    @IsString()
    @MaxLength(50)
    name: string;

    @Expose()
    @IsDateString()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'Date must be in the format yyyy-mm-dd.',
    })
    @IsDateString()
    estDate: string;

    @Expose()
    @IsString()
    @MaxLength(50)
    presentativeName: string;

    @Expose()
    @IsString()
    address: string;

    @Expose()
    @IsEnum(CompanyType)
    type: CompanyType;

    @Expose()
    @IsString()
    @MaxLength(10)
    businessRegNum: string;

    @Expose()
    @IsString()
    @MaxLength(13)
    corporateRegNum: string;

    @Expose()
    @IsArray()
    attachments: FileRequest[];

    @Expose()
    @IsNotEmptyObject()
    contactCard: FileRequest;

    @Expose()
    @IsNotEmptyObject()
    logo: FileRequest;
}
