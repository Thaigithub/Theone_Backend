import { ExperienceType } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';

export class MatchingCompanyCreateRecommendationRequest {
    @Expose()
    @IsOptional()
    occupationList: number[];

    @Expose()
    @IsOptional()
    regionList: string[];

    @Expose()
    @IsEnum(ExperienceType)
    @IsOptional()
    career: ExperienceType;
}
