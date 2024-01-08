import { ApiProperty } from '@nestjs/swagger';
import { PostApplicationStatus } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsEnum, IsNumberString, IsOptional, IsString, Matches } from 'class-validator';

export class ApplicationMemberGetListRequest {
    @IsOptional()
    @IsEnum(PostApplicationStatus)
    status: PostApplicationStatus;

    @ApiProperty({
        type: 'string',
        required: false,
    })
    @Expose()
    @IsNumberString()
    @IsOptional()
    pageSize: string;

    @ApiProperty({
        type: 'string',
        required: false,
    })
    @Expose()
    @IsNumberString()
    @IsOptional()
    pageNumber: string;

    @Expose()
    @IsString()
    @IsOptional()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'The property must be in the format yyyy-mm-dd.',
    })
    @ApiProperty({
        description: 'Start date',
        example: '2023-05-10',
    })
    startDate: string;

    @Expose()
    @IsString()
    @IsOptional()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'The property must be in the format yyyy-mm-dd.',
    })
    @ApiProperty({
        description: 'End date',
        example: '2023-05-10',
    })
    endDate: string;
}
