import { FileType } from '@prisma/client';

export class CompanyCompanyGetDetail {
    name: string;
    logo: {
        fileName: string;
        type: FileType;
        key: string;
    };
}
