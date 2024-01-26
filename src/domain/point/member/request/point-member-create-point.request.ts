import { Expose } from 'class-transformer';
import { IsNotEmptyObject } from 'class-validator';
import { FileRequest } from 'utils/generics/file.request';

export class PointMemberCreateRequest {
    @Expose()
    @IsNotEmptyObject()
    file: FileRequest;
}
