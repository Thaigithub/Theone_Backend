import { ExperienceType } from '@prisma/client';
import { Expose, Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString, Matches } from 'class-validator';
import { MatchingCompanyGetListDateEnum } from '../dto/matching-company-get-list-date.enum';

export class MatchingCompanyGetListRecommendationRequest {
    @Expose()
    @IsOptional()
    @IsNumber({}, { each: true })
    @Transform(({ value }) => value && (value.length > 1 ? value.map(Number) : [parseInt(value)]))
    public occupationId: number[];

    @Expose()
    @IsOptional()
    @IsNumber({}, { each: true })
    @Transform(({ value }) => value && (value.length > 1 ? value.map(Number) : [parseInt(value)]))
    public specialNoteId: number[];

    @Expose()
    @IsString()
    @IsOptional()
    @Matches(/^\d+-\d+$/, {
        message: 'Invalid format. Please use the format: "123-456".',
    })
    public regionId: string;

    @Expose()
    @IsEnum(ExperienceType)
    @IsOptional()
    public career: ExperienceType;

    @Expose()
    @IsEnum(MatchingCompanyGetListDateEnum)
    @IsOptional()
    public date: MatchingCompanyGetListDateEnum;
}
