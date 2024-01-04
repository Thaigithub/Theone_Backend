import { Expose } from 'class-transformer';
import { FileRequest } from 'utils/generics/file.request';

export class Banner {
    @Expose()
    file: FileRequest;
}
