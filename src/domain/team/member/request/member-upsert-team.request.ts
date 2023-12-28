import { ApiProperty } from '@nestjs/swagger';
import { FileType } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsBoolean, IsEnum, IsNumber, IsString } from 'class-validator';

export class MemberCreateTeamRequest {
    @Expose()
    @IsString()
    @ApiProperty({ type: 'string', example: 'Team A' })
    public teamName: string;

    @Expose()
    @IsString()
    @ApiProperty({ type: 'string', example: 'Team A introduction' })
    public introduction: string;

    @Expose()
    @ApiProperty({ type: Number })
    public codeId: number;

    @Expose()
    @ApiProperty({ type: Number, example: 1 })
    public dictrictId: number;
}

export class MemberUpdateExposureStatusTeamRequest {
    @Expose()
    @IsBoolean()
    @ApiProperty({ type: Boolean, example: true })
    public exposureStatus: boolean;
}

export class MemberUpdateTeamRequest extends MemberCreateTeamRequest {
    @Expose()
    @IsNumber()
    @ApiProperty({ example: 1 })
    public id: number;

    @ApiProperty({ example: 'basic.pdf' })
    public fileName: string;

    @Expose()
    @IsEnum(FileType)
    @ApiProperty({
        type: 'enum',
        enum: FileType,
        example: FileType.PDF,
    })
    public fileType: FileType;

    @Expose()
    @IsNumber()
    @ApiProperty({ example: 100 })
    public fileSize: number;
}
