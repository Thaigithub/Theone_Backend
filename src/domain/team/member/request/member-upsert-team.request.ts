import { ApiProperty } from '@nestjs/swagger';
import { FileType } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsEnum, IsNumber, IsString } from 'class-validator';

export class MemberCreateTeamRequest {
    @Expose()
    @IsString()
    @ApiProperty({ example: 'Team A' })
    public teamName: string;

    @Expose()
    @IsString()
    @ApiProperty({ example: 'Team A introduction' })
    public introduction: string;

    @Expose()
    @IsString()
    @ApiProperty({ example: 'asdfhjawbecqertq' })
    public fileKey: string;

    @Expose()
    @IsString()
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

export class MemberUpdateTeamRequest extends MemberCreateTeamRequest {
    @Expose()
    @IsNumber()
    @ApiProperty({ example: 1 })
    public id: number;
}
