import { FileType } from '@prisma/client';

export class FileResponse {
    fileName: string;
    type: FileType;
    key: string;
    size: number;
}
