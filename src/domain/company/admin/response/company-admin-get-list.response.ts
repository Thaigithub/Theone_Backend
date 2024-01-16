import { Account, Company } from '@prisma/client';
import { PaginationResponse } from 'utils/generics/pagination.response';

export class CompanyResponse {
    id: Company['id'];
    name: Company['name'];
    username: Account['username'];
    type: Company['type'];
    contactName: Company['contactName'];
    contactPhone: Company['contactPhone'];
    regDate: Account['createdAt'];
}

export class CompanyAdminGetListResponse extends PaginationResponse<CompanyResponse> {}
