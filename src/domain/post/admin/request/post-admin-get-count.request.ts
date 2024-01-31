import { Expose } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';
import { PostAdminCountCategory } from '../enum/post-admin-count-category.enum';

export class PostAdminGetCountRequest {
    @Expose()
    @IsEnum(PostAdminCountCategory)
    @IsOptional()
    category: PostAdminCountCategory;
}
