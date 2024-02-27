import { PostCategory, PostType } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsEnum, IsOptional, IsString, Matches } from 'class-validator';
import { PaginationRequest } from 'utils/generics/pagination.request';

export class PostMemberGetListRequest extends PaginationRequest {
    @Expose()
    @IsString()
    @IsOptional()
    keyword: string;

    @Expose()
    @IsEnum(PostType)
    @IsOptional()
    postType: PostType;

    @Expose()
    @IsString()
    @IsOptional()
    occupationList: string[];

    @Expose()
    @IsString()
    @IsOptional()
    constructionMachineryList: string[];

    @Expose()
    @IsString()
    @IsOptional()
    experienceTypeList: string[];

    @Expose()
    @IsString()
    @Matches(/^(([0-9]+-[0-9]+)|([0-9]+-[0-9]+,){1,4}([0-9]+-[0-9]+))$/, {
        message: 'The regionList must be in format 00-000 or 00-000,00-000...(5 times)',
    })
    @IsOptional()
    regionList: string[];

    @Expose()
    @IsEnum(PostCategory)
    @IsOptional()
    category: PostCategory;
}
