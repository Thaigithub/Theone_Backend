import { ProductType } from '@prisma/client';
import { Expose } from 'class-transformer';
import {
    ArrayMaxSize,
    ArrayMinSize,
    IsArray,
    IsObject,
    Validate,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';

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

class ChangePayAndUsagePayload {
    productType: ProductType;
    isFree: boolean;
    usageCycle: number;
}

export class ProductAdminUpdatePayAndUsageRequest {
    @Expose()
    @IsArray()
    @ArrayMinSize(1)
    @ArrayMaxSize(7)
    @IsObject({ each: true })
    @Validate(IsChangePayAndUsagePayloadArray, {
        message: 'Array contains invalid object',
    })
    payload: ChangePayAndUsagePayload[];
}
