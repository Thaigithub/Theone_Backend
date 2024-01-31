import { Product, UsageHistory } from '@prisma/client';
import { PaginationResponse } from 'utils/generics/pagination.response';

export class ProductCompanyUsageHistoryResponse {
    product: {
        productType: Product['productType'];
        countLimit: Product['countLimit'];
        monthLimit: Product['monthLimit'];
        usageType: Product['usageType'];
    };
    createdAt: UsageHistory['createdAt'];
    expirationDate: UsageHistory['expirationDate'];
    numberOfUses: number;
    remainNumber: UsageHistory['remainNumbers'];
}

export class ProductCompanyUsageHistoryGetListResponse extends PaginationResponse<ProductCompanyUsageHistoryResponse> {}
