import { AdminAdminGetResponse } from '../dto/admin-admin-response.dto';

export class AdminAdminGetDetailResponse extends AdminAdminGetResponse {
    account: {
        username: string;
    };
    permissions: {
        function: {
            name: string;
        };
    }[];
}
