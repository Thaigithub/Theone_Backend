import { Expose } from 'class-transformer';

class NumberOfTimesProperties {
    id: number;
    price: number;
}

class ProductTypeProperties {
    _1times: NumberOfTimesProperties;
    _3times: NumberOfTimesProperties;
    _5times: NumberOfTimesProperties;
    _10times: NumberOfTimesProperties;
}

export class ProductAdminUpdateByNumberRequest {
    @Expose()
    PULL_UP: ProductTypeProperties;
    @Expose()
    PREMIUM_POST: ProductTypeProperties;
    @Expose()
    WORKER_VERIFICATION: ProductTypeProperties;
    @Expose()
    LABOR_CONSULTATION: ProductTypeProperties;
    @Expose()
    BANNER: ProductTypeProperties;
    @Expose()
    HEADHUNTING_SERVICE: ProductTypeProperties;
    @Expose()
    COMPANY_MATCHING_SERVICE: ProductTypeProperties;
}
