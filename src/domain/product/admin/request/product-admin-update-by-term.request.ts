import { Expose } from 'class-transformer';

class NumberOfTimesProperties {
    id: number;
    numberOfTimes: number;
    price: number;
}

class PeriodProperties {
    ONE_MONTH: NumberOfTimesProperties;
    THREE_MONTHS: NumberOfTimesProperties;
    SIX_MONTHS: NumberOfTimesProperties;
    TWELVE_MONTHS: NumberOfTimesProperties;
}

export class ProductAdminUpdateByTermRequest {
    @Expose()
    PULL_UP: PeriodProperties;
    @Expose()
    PREMIUM_POST: PeriodProperties;
    @Expose()
    WORKER_VERIFICATION: PeriodProperties;
    @Expose()
    LABOR_CONSULTATION: PeriodProperties;
    @Expose()
    BANNER: PeriodProperties;
    @Expose()
    HEADHUNTING_SERVICE: PeriodProperties;
    @Expose()
    COMPANY_MATCHING_SERVICE: PeriodProperties;
}
