import { Company, Product, ProductPaymentHistory, Refund } from '@prisma/client';
import { PaginationResponse } from 'utils/generics/pagination.response';

class SettlementResponse {
    id: ProductPaymentHistory['id'];
    companyName: Company['name'];
    productType: Product['productType'];
    paymentDate: string;
    paymentMethod: ProductPaymentHistory['paymentType'];
    cost: ProductPaymentHistory['cost'];
    paymentStatus: ProductPaymentHistory['status'];
    refundStatus: Refund['status'];
}

export class ProductAdminGetListSettlementResponse extends PaginationResponse<SettlementResponse> {}
