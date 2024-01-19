import { RequestObject } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class PostCompanyCreateHeadhuntingRequestRequest {
    @Expose()
    @IsEnum(RequestObject)
    object: RequestObject;

    @Expose()
    @IsString()
    @IsOptional()
    detail: string;
}
