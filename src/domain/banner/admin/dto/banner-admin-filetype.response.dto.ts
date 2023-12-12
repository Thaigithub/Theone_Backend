import { ApiProperty } from '@nestjs/swagger';
import { File, FileType } from '@prisma/client';
export class FileClass {
    @ApiProperty({ type: String })
    key: File['key'];
    @ApiProperty({ type: String })
    fileName: File['fileName'];
    @ApiProperty({ type: 'enum', enum: FileType })
    type: File['type'];
    @ApiProperty({ type: String })
    size: File['size'];
}
