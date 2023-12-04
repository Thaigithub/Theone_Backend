import { $Enums, Prisma } from '@prisma/client';
import { BaseEntity } from '../../helpers/entity/base.entity';

export class File extends BaseEntity implements Prisma.FileUncheckedCreateInput {
    constructor(type: $Enums.FileType, key: string, fileName: string, size: number) {
        super();
        this.type = type;
        this.key = key;
        this.fileName = fileName;
        this.size = size;
    }

    id?: number;
    type: $Enums.FileType;
    key: string;
    fileName: string;
    size: number;
    isActive?: boolean;
    createdAt?: string | Date;
    updatedAt?: string | Date;
}
