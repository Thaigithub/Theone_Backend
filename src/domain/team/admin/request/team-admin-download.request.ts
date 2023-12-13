import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsNumber, IsNumberString } from 'class-validator';

export class AdminTeamDownloadListRequest {
    @Expose()
    @IsArray()
    @ArrayNotEmpty({ message: 'The array must not be empty' })
    @IsNumber({}, { each: true, message: 'Each element of the array must be a number' })
    @ApiProperty({ example: [1, 2, 3] })
    public teamIds: string[];
}

export class AdminTeamDownloadRequest {
    @Expose()
    @IsNumberString()
    @ApiProperty({ example: '1' })
    public teamIds: string;
}
