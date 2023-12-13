import { ApiProperty } from '@nestjs/swagger';
import { PostBannerType } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsEnum, IsNumber } from 'class-validator';
import { Banner } from './banner-admin-banner.dto';

export class PostBanner extends Banner {
    @Expose()
    @IsNumber()
    @ApiProperty({
        required: true,
        description: 'Post Id',
        example: 1,
    })
    postId: number;

    @Expose()
    @IsEnum(PostBannerType)
    @ApiProperty({
        required: true,
        description: 'Post Banner type',
        example: 'ADMIN',
    })
    type: PostBannerType;
}
