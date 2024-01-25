import { Expose } from 'class-transformer';
import { ArrayMaxSize, ArrayUnique, IsArray, IsNumber, IsOptional } from 'class-validator';
import { AnnouncementAdminCreateRequest } from './announcement-admin-create.request';

export class AnnouncementAdminUpdateRequest extends AnnouncementAdminCreateRequest {
    @Expose()
    @IsOptional()
    @IsArray()
    @IsNumber({}, { each: true })
    @ArrayUnique()
    @ArrayMaxSize(3)
    removeFileIds: number[];
}
