import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsBoolean, IsDateString, IsNotEmpty, IsString, Matches } from 'class-validator';

export class CareerMemberCreateRequest {
    @ApiProperty({
        type: 'string',
    })
    @Expose()
    @IsString()
    @IsNotEmpty()
    public companyName: string;

    @ApiProperty({
        type: 'string',
    })
    @Expose()
    @IsString()
    @IsNotEmpty()
    public siteName: string;

    @ApiProperty({
        type: 'string',
        format: 'date',
    })
    @Expose()
    @IsDateString()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'The property must be in the format yyyy-mm-dd.',
    })
    public startDate: string;

    @ApiProperty({
        type: 'string',
        format: 'date',
    })
    @Expose()
    @IsDateString()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'The property must be in the format yyyy-mm-dd.',
    })
    public endDate: string;

    @ApiProperty({
        type: 'string',
    })
    @Expose()
    @IsString()
    public occupation: string;

    @ApiProperty({
        type: 'boolean',
    })
    @Expose()
    @IsBoolean()
    public isExperienced: boolean;
}
