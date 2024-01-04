import { ApiProperty } from '@nestjs/swagger';
import { PostStatus, PostType } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationRequest } from 'utils/generics/pagination.request';

export class PostCompanyGetListRequest extends PaginationRequest {
    @Expose()
    @IsString()
    @IsOptional()
    public name: string;

    @Expose()
    @IsEnum(PostType)
    @IsOptional()
    @ApiProperty({
        type: 'enum',
        enum: PostType,
    })
    public type: PostType;

    @Expose()
    @IsEnum(PostStatus)
    @IsOptional()
    @ApiProperty({
        type: 'enum',
        enum: PostStatus,
    })
    public status: PostStatus;
}
