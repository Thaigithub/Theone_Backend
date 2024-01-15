import { Company, Product, ProductPaymentHistory, Refund } from '@prisma/client';

export class ProductAdminGetDetailRefundResponse {
    companyName: Company['name'];
    presentativeName: Company['presentativeName'];
    contact: Company['phone'];
    productType: Product['productType'];
    usageType: Product['usageType'];
    amount: ProductPaymentHistory['cost'];
    status: Refund['status'];
    createdAt: Refund['createdAt'];
}
