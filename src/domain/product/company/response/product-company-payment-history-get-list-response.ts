import { CardReceipt, Product, ProductPaymentHistory, Refund } from '@prisma/client';
import { PaginationResponse } from 'utils/generics/pagination.response';
import { ProductCompanyTaxInvoiceType } from '../enum/product-company-tax-invoice-type.enum';

export class ProductCompanyPaymentHistoryResponse {
    id: ProductPaymentHistory['id'];
    product: {
        type: Product['productType'];
        countLimit: Product['countLimit'];
        monthLimit: Product['monthLimit'];
        usageType: Product['usageType'];
    };
    createdAt: ProductPaymentHistory['createdAt'];
    cost: ProductPaymentHistory['cost'];
    paymentType: ProductPaymentHistory['paymentType'];
    cardReceiptStatus: CardReceipt['status'];
    taxBillStatus: ProductCompanyTaxInvoiceType;
    refundStatus: Refund['status'];
}

export class ProductCompanyPaymentHistoryGetListResponse extends PaginationResponse<ProductCompanyPaymentHistoryResponse> {}
