import { ApiProperty } from '@nestjs/swagger';
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
    @ApiProperty({
        type: 'enum',
        enum: PostType,
    })
    type: PostType;

    @Expose()
    @IsEnum(PostStatus)
    @IsOptional()
    @ApiProperty({
        type: 'enum',
        enum: PostStatus,
    })
    status: PostStatus;
}
