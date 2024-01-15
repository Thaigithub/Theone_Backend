import { Expose } from 'class-transformer';
import { ArrayUnique, IsArray, IsBoolean, IsNumber } from 'class-validator';

export class PostAdminUpdatePullupRequest {
    @Expose()
    @IsBoolean()
    isPulledUp: boolean;

    @Expose()
    @IsNumber({}, { each: true })
    @ArrayUnique()
    @IsArray()
    ids: number[];
}
