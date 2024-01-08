import { ApiProperty } from '@nestjs/swagger';
import { PostType } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationRequest } from 'utils/generics/pagination.request';

export class PostCompanyGetListApplicantSiteRequest extends PaginationRequest {
    @Expose()
    @IsString()
    @IsOptional()
    startDate: string;

    @Expose()
    @IsString()
    @IsOptional()
    endDate: string;

    @Expose()
    @IsString()
    @IsOptional()
    keyword: string;

    @Expose()
    @IsEnum(PostType)
    @IsOptional()
    @ApiProperty({
        type: 'enum',
        enum: PostType,
    })
    type: PostType;
}
