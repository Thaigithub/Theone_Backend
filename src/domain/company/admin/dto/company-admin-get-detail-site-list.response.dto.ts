import { Site } from '@prisma/client';

export class CompanyAdminGetDetailCompanySiteList {
    id: Site['id'];
    name: Site['name'];
}
