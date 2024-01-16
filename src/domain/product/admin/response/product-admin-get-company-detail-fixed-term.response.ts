class Terms {
    _1months: number;
    _3months: number;
    _6months: number;
    _10months: number;
}

class FixedTermProducts {
    PULL_UP: Terms;
    PREMIUM_POST: Terms;
    WORKER_VERIFICATION: Terms;
    LABOR_CONSULTATION: Terms;
    BANNER: Terms;
    HEADHUNTING_SERVICE: Terms;
    COMPANY_MATCHING_SERVICE: Terms;
}

export class ProductAdminGetCompanyDetailFixedTermResponse {
    products: FixedTermProducts;
}
