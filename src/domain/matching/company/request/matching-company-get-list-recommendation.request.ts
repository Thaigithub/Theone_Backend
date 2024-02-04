import { Expose } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';
import { MatchingCompanyGetListDate } from '../enum/matching-company-get-list-date.enum';

export class MatchingCompanyGetListRecommendationRequest {
    @Expose()
    @IsEnum(MatchingCompanyGetListDate)
    @IsOptional()
    date: MatchingCompanyGetListDate;
}
