import { CodeType } from '@prisma/client';

export class PostAdminCodeDTO {
    code: string;
    codeName: string;
    codeType: CodeType;
}
