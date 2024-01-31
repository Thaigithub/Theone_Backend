import { RequestObject } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class HeadhuntingCompanyCreateRequestRequest {
    @Expose()
    @IsEnum(RequestObject)
    object: RequestObject;

    @Expose()
    @IsString()
    @IsOptional()
    detail: string;
}
