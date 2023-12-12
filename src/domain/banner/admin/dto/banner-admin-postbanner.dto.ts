import { PostBannerType } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsEnum, IsNumber } from 'class-validator';
import { Banner } from './banner-admin-banner.dto';
import { ApiProperty } from '@nestjs/swagger';

export class PostBanner extends Banner {
    @Expose()
    @IsNumber()
    @ApiProperty({
        description: 'Post Id',
        example: 1,
    })
    postId: number;

    @Expose()
    @IsEnum(PostBannerType)
    @ApiProperty({
        description: 'Post Banner type',
        example: 'ADMIN',
    })
    type: PostBannerType;
}
