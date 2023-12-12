import { ApiProperty } from '@nestjs/swagger';
import { FileType } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsEnum, IsNumber, IsString } from 'class-validator';

class File {
    @Expose()
    @IsString()
    @ApiProperty({
        description: 'File key',
        example: '2g3f34rgf',
    })
    readonly key: string;

    @Expose()
    @IsString()
    @ApiProperty({
        description: 'File name',
        example: 'fsdvsd.pdf',
    })
    readonly fileName: string;

    @Expose()
    @IsEnum(FileType)
    @ApiProperty({
        description: 'File type',
        example: 'PDF',
    })
    readonly type: FileType;

    @Expose()
    @IsNumber()
    @ApiProperty({
        description: 'File size',
        example: '23442',
    })
    readonly size: number;
}

export class Banner {
    @Expose()
    readonly file: File;
}
