import { Expose } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';
import { SiteAdminGetCountCategory } from '../enum/site-admin-get-count-category.enum';

export class SiteAdminGetCountRequest {
    @Expose()
    @IsEnum(SiteAdminGetCountCategory)
    @IsOptional()
    category: SiteAdminGetCountCategory;
}
