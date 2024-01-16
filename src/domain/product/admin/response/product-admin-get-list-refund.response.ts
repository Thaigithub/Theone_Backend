import { Company, Product, ProductPaymentHistory, Refund } from '@prisma/client';
import { PaginationResponse } from 'utils/generics/pagination.response';

class GetListRefundResponse {
    id: Refund['id'];
    companyName: Company['name'];
    presentativeName: Company['presentativeName'];
    contact: Company['phone'];
    productType: Product['productType'];
    amount: ProductPaymentHistory['cost'];
    status: Refund['status'];
    createdAt: Refund['createdAt'];
}

export class ProductAdminGetListRefundResponse extends PaginationResponse<GetListRefundResponse> {}
