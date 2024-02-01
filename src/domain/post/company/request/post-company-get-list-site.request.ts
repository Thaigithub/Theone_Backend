import { PostCategory } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';

export class PostCompanyGetListSiteRequest {
    @Expose()
    @IsEnum(PostCategory)
    @IsOptional()
    category: PostCategory;
}
