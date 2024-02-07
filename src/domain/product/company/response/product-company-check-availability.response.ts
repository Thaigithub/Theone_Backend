import { ProductPaymentHistory, UsageType } from '@prisma/client';

export class ProductCompanyCheckAvailabilityResponse {
    isAvailable: boolean;
    productPaymentHistories: {
        id: ProductPaymentHistory['id'];
        remainingTimes: ProductPaymentHistory['remainingTimes'];
        expirationDate: ProductPaymentHistory['expirationDate'];
        usageType: UsageType;
    }[];
}
