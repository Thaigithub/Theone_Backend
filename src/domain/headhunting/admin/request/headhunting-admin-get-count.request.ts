import { Expose } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';
import { HeadhuntingAdminCountCategory } from '../enum/headhunting-admin-get-count-category.enum';

export class HeadhuntingAdminGetCountRequest {
    @Expose()
    @IsEnum(HeadhuntingAdminCountCategory)
    @IsOptional()
    category: HeadhuntingAdminCountCategory;
}
