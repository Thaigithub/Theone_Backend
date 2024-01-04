import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PostCompanyHeadhuntingRequestFilter } from '../enum/post-company-headhunting-request-filter.enum';
import { PaginationRequest } from 'utils/generics/pagination.request';

export class PostCompanyHeadhuntingRequestRequest extends PaginationRequest {
    @Expose()
    @IsString()
    @IsOptional()
    public keyword: string;

    @Expose()
    @IsEnum(PostCompanyHeadhuntingRequestFilter)
    @IsOptional()
    @ApiProperty({
        type: 'enum',
        enum: PostCompanyHeadhuntingRequestFilter,
    })
    public category: PostCompanyHeadhuntingRequestFilter;

    @Expose()
    @IsString()
    @IsOptional()
    public startDate: string;

    @Expose()
    @IsString()
    @IsOptional()
    public endDate: string;
}
