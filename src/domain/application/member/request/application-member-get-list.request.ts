import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNumberString, IsOptional, IsString, Matches } from 'class-validator';

export class ApplicationMemberGetListRequest {
    @ApiProperty({
        type: 'string',
        required: false,
    })
    @Expose()
    @IsNumberString()
    @IsOptional()
    public pageSize: string;

    @ApiProperty({
        type: 'string',
        required: false,
    })
    @Expose()
    @IsNumberString()
    @IsOptional()
    public pageNumber: string;

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
    public startDate: string;

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
    public endDate: string;
}
