import { ApiProperty } from '@nestjs/swagger';
import { File, FileType } from '@prisma/client';
export class FileClass {
    @ApiProperty({
        required: true,
        type: String,
    })
    key: File['key'];
    @ApiProperty({
        required: true,
        type: String,
    })
    fileName: File['fileName'];
    @ApiProperty({
        required: true,
        type: 'enum',
        enum: FileType,
    })
    type: File['type'];
    @ApiProperty({
        required: true,
        type: String,
    })
    size: File['size'];
}
