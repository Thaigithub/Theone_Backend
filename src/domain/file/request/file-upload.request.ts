import { Expose } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ContentType } from 'services/storage/storage.service';

export class FileUploadRequest {
    @Expose()
    @IsEnum(ContentType)
    @IsNotEmpty()
    contentType: ContentType;

    @Expose()
    @IsString()
    @IsNotEmpty()
    fileName: string;
}
