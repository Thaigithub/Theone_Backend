import { Expose } from 'class-transformer';
import { FileUploadRequest } from 'utils/generics/file.request';

export class Banner {
    @Expose()
    readonly file: FileUploadRequest;
}
