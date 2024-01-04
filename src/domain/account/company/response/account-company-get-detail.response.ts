import { Company } from '@prisma/client';
import { FileResponse } from 'utils/generics/file.response';

export class AccountCompanyGetDetailResponse {
    name: Company['name'];
    logo: FileResponse;
}
