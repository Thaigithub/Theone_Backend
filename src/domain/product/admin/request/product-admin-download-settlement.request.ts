import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class ProductAdminDownloadSettlementRequest {
    @IsString()
    @Expose()
    idList: string;
}
