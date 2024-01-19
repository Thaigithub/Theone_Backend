import { CodeType } from '@prisma/client';

export class CodeAdminGetDetailResponse {
    codeType: CodeType;
    code: string;
    codeName: string;
}
