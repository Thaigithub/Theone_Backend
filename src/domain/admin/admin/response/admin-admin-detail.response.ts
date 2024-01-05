import { Account, FunctionName } from '@prisma/client';
import { AdminAdminGetResponse } from '../dto/admin-admin-response.dto';

export class AdminAdminGetDetailResponse extends AdminAdminGetResponse {
    account: {
        username: Account['username'];
    };
    permissions: {
        function: {
            name: FunctionName;
        };
    }[];
}
