import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsDateString, IsNumberString, IsOptional, Matches } from 'class-validator';

export class AdminBannerGetGeneralRequest {
    @Expose()
    @IsOptional()
    @IsNumberString()
    @ApiProperty({ example: '1' })
    public pageNumber: string;

    @Expose()
    @IsOptional()
    @IsNumberString()
    @ApiProperty({ example: '1' })
    public pageSize: string;

    @Expose()
    @IsOptional()
    @IsDateString()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'The property must be in the format yyyy-mm-dd.',
    })
    @ApiProperty({
        description: 'Request from date',
        example: '2023-05-10',
    })
    public startDate: string;

    @Expose()
    @IsOptional()
    @IsDateString()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'The property must be in the format yyyy-mm-dd.',
    })
    @ApiProperty({
        description: 'Request end date',
        example: '2023-05-20',
    })
    public endDate: string;
}
