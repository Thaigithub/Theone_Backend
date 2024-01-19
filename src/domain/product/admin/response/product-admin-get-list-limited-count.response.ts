class CountLimitProperties {
    id: number;
    price: number;
}

class ProductTypeProperties {
    _1times: CountLimitProperties;
    _3times: CountLimitProperties;
    _5times: CountLimitProperties;
    _10times: CountLimitProperties;
}

class ListProducts {
    PULL_UP: ProductTypeProperties;
    PREMIUM_POST: ProductTypeProperties;
    WORKER_VERIFICATION: ProductTypeProperties;
    LABOR_CONSULTATION: ProductTypeProperties;
    BANNER: ProductTypeProperties;
    HEADHUNTING_SERVICE: ProductTypeProperties;
    COMPANY_MATCHING_SERVICE: ProductTypeProperties;
}

export class ProductAdminGetListLimitedCountResponse {
    listProducts: ListProducts;
    monthLimit: number;
}
