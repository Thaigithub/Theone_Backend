import { ApiProperty } from '@nestjs/swagger';
import { PermissionDTO } from '../dto/admin-admin-permission.dto';
import { AdminAdminCreateAdminDTO } from '../request/admin-admin-create-admin.dto';
import { AdminAdminResponse } from './admin-admin.response';

export class AdminAdminDetailResponse extends AdminAdminResponse {
    @ApiProperty({ type: AdminAdminCreateAdminDTO })
    account: AdminAdminCreateAdminDTO;

    @ApiProperty({ type: [PermissionDTO] })
    permissions: PermissionDTO[];
}
