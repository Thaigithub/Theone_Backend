import { Account, Admin, FunctionName } from '@prisma/client';

export class AdminAdminGetDetailResponse {
    id: Admin['id'];
    name: Admin['name'];
    level: Admin['level'];
    account: {
        username: Account['username'];
    };
    permissions: {
        function: {
            name: FunctionName;
        };
    }[];
}
