import { Expose } from 'class-transformer';
import { IsBoolean } from 'class-validator';

export class PostAdminUpdateExposureRequest {
    @Expose()
    @IsBoolean()
    isHidden: boolean;
}
