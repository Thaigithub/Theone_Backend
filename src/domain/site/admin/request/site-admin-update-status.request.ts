import { SiteStatus } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class SiteAdminUpdateRequest {
    @Expose()
    @IsEnum(SiteStatus)
    status: SiteStatus;

    @Expose()
    @IsString()
    @IsOptional()
    content: string;
}
