import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { ContentType } from 'services/storage/storage.service';
// import { Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class FileUploadRequest {
    @ApiProperty({ required: true })
    @Expose()
    @IsEnum(ContentType)
    @IsNotEmpty()
    public contentType: ContentType;

    @ApiProperty({ required: true })
    @Expose()
    @IsString()
    @IsNotEmpty()
    public fileName: string;
}
