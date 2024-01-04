import { ApiProperty } from '@nestjs/swagger';
import { PostType } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationRequest } from 'utils/generics/pagination.request';

export class PostCompanyGetListApplicantSiteRequest extends PaginationRequest {
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
}
