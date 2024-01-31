import { Expose } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class AccountMemberUpdateRegionRequest {
    @IsNumber()
    @Expose()
    regionId: number;
}
