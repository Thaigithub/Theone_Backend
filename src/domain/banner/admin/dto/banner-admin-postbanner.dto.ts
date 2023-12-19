import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNumber } from 'class-validator';
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
}
