import { PostType } from '@prisma/client';
import { Expose } from 'class-transformer';
import { ArrayUnique, IsArray, IsEnum, IsNumber } from 'class-validator';

export class PostAdminUpdateTypeRequest {
    @Expose()
    @IsEnum(PostType)
    type: PostType;

    @Expose()
    @IsArray()
    @IsNumber({}, { each: true })
    @ArrayUnique()
    ids: number[];
}
