import { ApiProperty } from '@nestjs/swagger';
import { PostType } from '@prisma/client';
import { Expose, Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class PostCompanyGetListApplicantSiteRequest {
    @Expose()
    @IsString()
    @IsOptional()
    public startDate: string;

    @Expose()
    @IsString()
    @IsOptional()
    public endDate: string;

    @Expose()
    @IsString()
    @IsOptional()
    public keyword: string;

    @Expose()
    @IsEnum(PostType)
    @IsOptional()
    @ApiProperty({
        type: 'enum',
        enum: PostType,
    })
    public type: PostType;

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
