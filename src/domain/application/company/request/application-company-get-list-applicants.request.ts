import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApplicationCompanyApplicantsSearch } from '../dto/applicants/application-company-applicants-search.enum';

export class ApplicationCompanyGetListApplicantsRequest {
    @ApiProperty({
        type: 'enum',
        enum: ApplicationCompanyApplicantsSearch,
        required: false,
    })
    @Expose()
    @IsEnum(ApplicationCompanyApplicantsSearch)
    @IsOptional()
    public searchCategory: ApplicationCompanyApplicantsSearch;

    @ApiProperty({
        type: 'string',
        required: false,
    })
    @Expose()
    @IsString()
    @IsOptional()
    public keyword: string;

    @ApiProperty({
        type: 'number',
        required: false,
    })
    @Expose()
    @IsNumber()
    @IsOptional()
    @Transform(({ value }) => value && parseInt(value))
    public pageSize: number;

    @ApiProperty({
        type: 'number',
        required: false,
    })
    @Expose()
    @IsNumber()
    @IsOptional()
    @Transform(({ value }) => value && parseInt(value))
    public pageNumber: number;

    @Expose()
    @IsString()
    @IsOptional()
    public startApplicationDate: string;

    @Expose()
    @IsString()
    @IsOptional()
    @ApiProperty({
        type: 'string',
        required: false,
        example: '2023-12-2',
    })
    public endApplicationDate: string;
}
