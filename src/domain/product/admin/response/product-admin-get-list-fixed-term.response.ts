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

export class ProductAdminGetListFixedTermResponse {
    PULL_UP: PeriodProperties;
    PREMIUM_POST: PeriodProperties;
    WORKER_VERIFICATION: PeriodProperties;
    LABOR_CONSULTATION: PeriodProperties;
    BANNER: PeriodProperties;
    HEADHUNTING_SERVICE: PeriodProperties;
    COMPANY_MATCHING_SERVICE: PeriodProperties;
}
