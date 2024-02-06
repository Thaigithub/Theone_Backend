import { ExperienceType } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsArray, IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class MatchingCompanyCreateRecommendationRequest {
    @Expose()
    @IsOptional()
    occupationList: number[];

    @Expose()
    @IsOptional()
    regionList: string[];

    @Expose()
    @IsEnum(ExperienceType, { each: true })
    @IsArray()
    @IsOptional()
    careerList: ExperienceType[];

    @Expose()
    @IsNumber()
    @IsOptional()
    @Min(1)
    salary: number;

    @Expose()
    @IsString()
    @IsOptional()
    keyword: string;
}
