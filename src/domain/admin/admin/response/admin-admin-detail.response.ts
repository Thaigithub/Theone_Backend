import { ApiProperty } from '@nestjs/swagger';
import { AccountAdminCreateAdminDTO } from 'domain/account/dto/account-admin-create-admin.dto';
import { PermissionDTO } from '../dto/admin-admin-permission.dto';
import { AdminAdminResponse } from './admin-admin.response';

export class AdminAdminDetailResponse extends AdminAdminResponse {
    @ApiProperty({ type: AccountAdminCreateAdminDTO })
    account: AccountAdminCreateAdminDTO;

    @ApiProperty({ type: [PermissionDTO] })
    permissions: PermissionDTO[];
}
