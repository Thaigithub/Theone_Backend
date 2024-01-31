import { ExperienceType } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { MatchingCompanyGetListDate } from '../enum/matching-company-get-list-date.enum';

export class MatchingCompanyGetListRecommendationRequest {
    @Expose()
    @IsEnum(ExperienceType)
    @IsOptional()
    career: ExperienceType;

    @Expose()
    @IsEnum(MatchingCompanyGetListDate)
    @IsOptional()
    date: MatchingCompanyGetListDate;

    @Expose()
    @IsString()
    @IsOptional()
    occupation: string;

    @Expose()
    @IsString()
    @IsOptional()
    region: string;
}
