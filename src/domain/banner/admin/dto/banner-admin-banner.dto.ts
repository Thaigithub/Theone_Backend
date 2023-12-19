import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { FileClass } from './banner-admin-filetype.response.dto';

export class Banner {
    @Expose()
    @ApiProperty({ type: FileClass })
    readonly file: FileClass;
}
