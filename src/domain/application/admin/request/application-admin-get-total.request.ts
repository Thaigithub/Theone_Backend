import { PostType } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';

export class ApplicationAdminGetTotalRequest {
    @Expose()
    @IsEnum(PostType)
    @IsOptional()
    postType: PostType;
}
