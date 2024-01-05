import { Expose } from 'class-transformer';
import { IsArray } from 'class-validator';

export class BannerAdminUpdatePriority {
    @Expose()
    @IsArray()
    data: {
        id: number;
        priority: number;
    }[];
}
