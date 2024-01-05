import { BannerStatus } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsEnum } from 'class-validator';
import { FileRequest } from 'utils/generics/file.request';

export class Banner {
    @Expose()
    file: FileRequest;

    @Expose()
    @IsEnum(BannerStatus)
    status: BannerStatus;
}
