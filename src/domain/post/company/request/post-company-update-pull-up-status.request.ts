import { Expose } from 'class-transformer';
import { Equals, IsBoolean } from 'class-validator';

export class PostCompanyUpdatePullUpStatusRequest {
    @Expose()
    @IsBoolean()
    @Equals(true)
    pullUpStatus: boolean;
}
