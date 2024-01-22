import { PostType } from '@prisma/client';
import { Expose } from 'class-transformer';
import { Equals, IsEnum } from 'class-validator';

export class PostCompanyUpdateTypeRequest {
    @Expose()
    @IsEnum(PostType)
    @Equals(PostType.PREMIUM)
    postType: PostType;
}
