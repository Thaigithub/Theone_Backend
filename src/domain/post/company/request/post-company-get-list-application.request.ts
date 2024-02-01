import { PostType } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationRequest } from 'utils/generics/pagination.request';

export class PostCompanyGetListApplicationRequest extends PaginationRequest {
    @Expose()
    @IsString()
    @IsOptional()
    startDate: string;

    @Expose()
    @IsString()
    @IsOptional()
    endDate: string;

    @Expose()
    @IsString()
    @IsOptional()
    keyword: string;

    @Expose()
    @IsEnum(PostType)
    @IsOptional()
    type: PostType;
}
