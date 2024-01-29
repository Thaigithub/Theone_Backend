import { Admin, FunctionName } from '@prisma/client';

export class AccountAdminGetDetailResponse {
    name: Admin['name'];
    level: Admin['level'];
    permissions: FunctionName[];
}
