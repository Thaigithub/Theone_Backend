import { Company } from '@prisma/client';
import { PaginationResponse } from 'utils/generics/pagination.response';

class GetListProductResponse {
    id: Company['id'];
    companyName: Company['name'];
    manager: Company['presentativeName'];
    contact: Company['contactPhone'];
    totalPaymentAmount: number;
}

export class CompanyAdminGetListProductResponse extends PaginationResponse<GetListProductResponse> {}
