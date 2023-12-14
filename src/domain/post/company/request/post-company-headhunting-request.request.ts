import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { PostCompanyHeadhuntingRequestFilter } from '../enum/post-company-headhunting-request-filter.enum';

export class PostCompanyHeadhuntingRequestRequest {
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

    @Expose()
    @IsNumber()
    @ApiProperty({
        type: 'number',
        required: false,
    })
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
}
