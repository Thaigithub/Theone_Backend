import { ExperienceType } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class MatchingCompanyCreateRecommendationRequest {
    @Expose()
    @IsString()
    @IsOptional()
    occupation: string;

    @Expose()
    @IsString()
    @IsOptional()
    region: string;

    @Expose()
    @IsEnum(ExperienceType)
    @IsOptional()
    career: ExperienceType;
}
