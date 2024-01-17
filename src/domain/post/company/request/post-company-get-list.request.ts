import { PostStatus, PostType } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationRequest } from 'utils/generics/pagination.request';

export class PostCompanyGetListRequest extends PaginationRequest {
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
