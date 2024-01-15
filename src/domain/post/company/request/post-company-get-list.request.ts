import { PostStatus, PostType } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationRequest } from 'utils/generics/pagination.request';
import { PostCompanyPostCategoryFilter } from '../enum/post-company-filter.enum';

export class PostCompanyGetListRequest extends PaginationRequest {
    @Expose()
    @IsEnum(PostCompanyPostCategoryFilter)
    @IsOptional()
    category: PostCompanyPostCategoryFilter;

    @Expose()
    @IsString()
    @IsOptional()
    name: string;

    @Expose()
    @IsEnum(PostType)
    @IsOptional()
    type: PostType;

    @Expose()
    @IsEnum(PostStatus)
    @IsOptional()
    status: PostStatus;
}
