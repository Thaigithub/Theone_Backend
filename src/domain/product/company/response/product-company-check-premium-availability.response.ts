import { ProductPaymentHistory } from '@prisma/client';

export class ProductCompanyCheckPremiumAvailabilityResponse {
    isAvailable: boolean;
    productList: {
        id: ProductPaymentHistory['id'];
        remainingTimes: ProductPaymentHistory['remainingTimes'];
        remainingDates: number;
    }[];
}
