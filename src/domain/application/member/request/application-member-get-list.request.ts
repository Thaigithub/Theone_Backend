import { ApiProperty } from '@nestjs/swagger';
import { PostApplicationStatus } from '@prisma/client';
import { Expose, Transform } from 'class-transformer';
import { IsDateString, IsEnum, IsNumber, IsNumberString, IsOptional, Matches } from 'class-validator';

export class ApplicationMemberGetListRequest {
    @ApiProperty({
        type: 'number',
        required: false,
    })
    @Expose()
    @IsNumberString()
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
    @IsEnum(PostApplicationStatus)
    @IsOptional()
    @ApiProperty({
        type: 'enum',
        enum: PostApplicationStatus,
    })
    public status: PostApplicationStatus;

    @Expose()
    @IsDateString()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'The property must be in the format yyyy-mm-dd.',
    })
    @ApiProperty({
        description: 'Start date',
        example: '2023-05-10',
    })
    @Transform(({ value }) => value && new Date(value))
    public startDate: Date;

    @Expose()
    @IsDateString()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'The property must be in the format yyyy-mm-dd.',
    })
    @ApiProperty({
        description: 'End date',
        example: '2023-05-10',
    })
    @Transform(({ value }) => value && new Date(value))
    public endDate: Date;
}
