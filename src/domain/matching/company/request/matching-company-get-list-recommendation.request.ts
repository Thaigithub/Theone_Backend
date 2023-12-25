import { ExperienceType } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';
import { MatchingCompanyGetListDateEnum } from '../dto/matching-company-get-list-date.enum';

export class MatchingCompanyGetListRecommendationRequest {
    @Expose()
    @IsEnum(ExperienceType)
    @IsOptional()
    public career: ExperienceType;

    @Expose()
    @IsEnum(MatchingCompanyGetListDateEnum)
    @IsOptional()
    public date: MatchingCompanyGetListDateEnum;
}
