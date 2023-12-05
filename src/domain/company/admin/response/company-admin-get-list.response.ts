import { Account, Company } from '@prisma/client';
import { PaginationResponse } from 'utils/generics/pageInfo.response';

class CompanyResponse {
    name: Company['name'];
    account: {
        username: Account['username'];
    };
    type: Company['type'];
    contactName: Company['contactName'];
    contactPhone: Company['contactPhone'];
}

export class AdminCompanyGetListResponse extends PaginationResponse<CompanyResponse> {}
