import { Admin } from '@prisma/client';

export class AdminAdminGetResponse {
    id: Admin['id'];
    name: Admin['name'];
    level: Admin['level'];
}
