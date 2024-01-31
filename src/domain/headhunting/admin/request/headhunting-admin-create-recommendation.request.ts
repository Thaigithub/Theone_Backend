import { Expose } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class HeadhuntingAdminCreateRecommendationRequest {
    @IsNumber()
    @Expose()
    id: number;
}
