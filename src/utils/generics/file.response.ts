import { FileType } from '@prisma/client';

export class FileUploadRequest {
    filename: string;
    size: number;
    type: FileType;
    key: string;
}
