import { Expose } from 'class-transformer';

class UsageCycleProperties {
    usageCycle: number;
}

export class ProductAdminUpdateUsageCycleRequest {
    @Expose()
    PULL_UP: UsageCycleProperties;
    @Expose()
    PREMIUM_POST: UsageCycleProperties;
    @Expose()
    WORKER_VERIFICATION: UsageCycleProperties;
    @Expose()
    LABOR_CONSULTATION: UsageCycleProperties;
    @Expose()
    BANNER: UsageCycleProperties;
    @Expose()
    HEADHUNTING_SERVICE: UsageCycleProperties;
    @Expose()
    COMPANY_MATCHING_SERVICE: UsageCycleProperties;
}
