import { ExperienceType } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { MatchingCompanyGetListDateEnum } from '../dto/matching-company-get-list-date.enum';

export class MatchingCompanyGetListRecommendationRequest {
    @Expose()
    @IsEnum(ExperienceType)
    @IsOptional()
    career: ExperienceType;

    @Expose()
    @IsEnum(MatchingCompanyGetListDateEnum)
    @IsOptional()
    date: MatchingCompanyGetListDateEnum;

    @Expose()
    @IsString()
    @IsOptional()
    occupation: string;

    @Expose()
    @IsString()
    @IsOptional()
    specialOccupation: string;

    @Expose()
    @IsString()
    @IsOptional()
    region: string;

    @Expose()
    @IsString()
    @IsOptional()
    keyword: string;
}
