import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNumberString, IsOptional } from 'class-validator';

export class AdminBannerGetAdminJobPostRequest {
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
}
