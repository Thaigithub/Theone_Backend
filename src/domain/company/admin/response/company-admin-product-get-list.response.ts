import { Company } from '@prisma/client';
import { PaginationResponse } from 'utils/generics/pagination.response';

class CompanyResponse {
    id: Company['id'];
    companyName: Company['name'];
    manager: Company['presentativeName'];
    contact: Company['contactPhone'];
    totalPaymentAmount: number;
}

export class CompanyAdminProductGetListResponse extends PaginationResponse<CompanyResponse> {}
