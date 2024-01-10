import { ProductType } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsArray, IsObject, Max, Min, Validate, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

class ChangePayAndUsagePayload {
    productType: ProductType;
    isFree: boolean;
    usageCycle: number;
}

@ValidatorConstraint()
class IsChangePayAndUsagePayloadArray implements ValidatorConstraintInterface {
    public async validate(payload: ChangePayAndUsagePayload[]) {
        return (
            Array.isArray(payload) &&
            payload.reduce(
                (a, b) =>
                    a &&
                    Object.values(ProductType).includes(b.productType) &&
                    ['undefined', 'boolean'].includes(typeof b.isFree) &&
                    ['undefined', 'number'].includes(typeof b.usageCycle),
                true,
            )
        );
    }
}

export class ProductAdminUpdatePayAndUsageRequest {
    @Expose()
    @IsArray()
    @Min(1)
    @Max(7)
    @IsObject({ each: true })
    @Validate(IsChangePayAndUsagePayloadArray, {
        message: 'Array contains invalid object',
    })
    payload: ChangePayAndUsagePayload[];
}
