import { ApiProperty } from '@nestjs/swagger';
import { DisabledLevel, DisabledType, FileType } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsEnum, IsNumber, IsString } from 'class-validator';

export class UpsertDisabilityRequest {
    @Expose()
    @IsEnum(DisabledLevel)
    @ApiProperty({
        type: 'enum',
        enum: DisabledLevel,
        example: DisabledLevel,
    })
    public disabledLevel: DisabledLevel;

    @Expose()
    @IsEnum(DisabledType)
    @ApiProperty({
        type: 'enum',
        enum: DisabledType,
        example: DisabledType.BURN,
    })
    public disabledType: DisabledType;

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
