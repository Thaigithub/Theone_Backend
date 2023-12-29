import { ExperienceType } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';
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

    @Expose()
    @IsString()
    @IsOptional()
    public occupationIds: string;

    @Expose()
    @IsString()
    @IsOptional()
    public specialOccupationIds: string;

    @Expose()
    @IsString()
    @IsOptional()
    public regionIds: string;
}
