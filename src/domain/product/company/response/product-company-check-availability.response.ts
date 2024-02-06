import { ProductPaymentHistory } from '@prisma/client';

export class ProductCompanyCheckAvailabilityResponse {
    isAvailable: boolean;
    paymentHistories: {
        id: ProductPaymentHistory['id'];
        remainingTimes: ProductPaymentHistory['remainingTimes'];
        expirationDate: ProductPaymentHistory['expirationDate'];
    }[];
}
