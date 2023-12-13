import { Expose } from 'class-transformer';
import { FileClass } from './banner-admin-filetype.response.dto';

export class Banner {
    @Expose()
    readonly file: FileClass;
}
