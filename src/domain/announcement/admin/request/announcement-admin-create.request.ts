import { Expose } from 'class-transformer';
import { IsNotEmptyObject, IsOptional, IsString, MaxLength } from 'class-validator';
import { FileRequest } from 'utils/generics/file.request';

export class AnnouncementAdminCreateRequest {
    @Expose()
    @IsString()
    @MaxLength(50)
    title: string;

    @Expose()
    @IsString()
    @MaxLength(1000)
    content: string;

    @Expose()
    @IsNotEmptyObject({}, { each: true })
    @IsOptional()
    files: FileRequest[];
}
