import { Expose } from 'class-transformer';

class CountLimitProperties {
    id: number;
    countLimit: number;
    price: number;
}

class PeriodProperties {
    _1months: CountLimitProperties;
    _3months: CountLimitProperties;
    _6months: CountLimitProperties;
    _12months: CountLimitProperties;
}

export class ProductAdminUpdateFixedTermRequest {
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
