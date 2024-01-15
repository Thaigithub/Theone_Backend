import { Expose } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';

export class PostAdminUpdateExposureRequest {
    @Expose()
    @IsBoolean()
    @IsOptional()
    isHidden: boolean;
}
