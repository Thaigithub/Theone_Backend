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
    public occupation: string;

    @Expose()
    @IsString()
    @IsOptional()
    public specialOccupation: string;

    @Expose()
    @IsString()
    @IsOptional()
    public region: string;

    @Expose()
    @IsString()
    @IsOptional()
    public keyword: string;
}
