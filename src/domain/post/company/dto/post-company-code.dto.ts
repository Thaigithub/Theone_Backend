import { CodeType } from '@prisma/client';

export class PostCompanyCodeDTO {
    code: string;
    codeName: string;
    codeType: CodeType;
}
