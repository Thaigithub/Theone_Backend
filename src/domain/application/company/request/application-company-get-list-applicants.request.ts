import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApplicationCompanyApplicantsSearch } from '../dto/applicants/application-company-applicants-search.enum';
import { PaginationRequest } from 'utils/generics/pagination.request';

export class ApplicationCompanyGetListApplicantsRequest extends PaginationRequest {
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

    @Expose()
    @IsString()
    @IsOptional()
    @ApiProperty({
        type: 'string',
        required: false,
    })
    public startApplicationDate: string;

    @Expose()
    @IsString()
    @IsOptional()
    @ApiProperty({
        type: 'string',
        required: false,
    })
    public endApplicationDate: string;
}
