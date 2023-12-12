import { ApiProperty } from '@nestjs/swagger';
import { FileType } from '@prisma/client';

export class ApplicationCompanyMemberDetailFileDTO {
    @ApiProperty({ type: 'enum', enum: FileType, example: FileType.JPEG })
    public type: FileType;

    @ApiProperty({ example: 'key' })
    public key: string;

    @ApiProperty({ example: 'fileName' })
    public fileName: string;

    @ApiProperty({ example: 100 })
    public size: bigint;
}
