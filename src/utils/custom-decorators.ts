import { BadRequestException } from '@nestjs/common';

export function ParseBoolean(): PropertyDecorator {
    /* The custom decorator is use to transform string value to boolean value */
    return function (target: any, propertyKey: string) {
        let value: string = target[propertyKey];

        const getter = function () {
            return value === 'true';
        };

        const setter = function (newValue: string) {
            if (newValue != 'true' && newValue !== 'false') {
                throw new BadRequestException(`The value must be 'true' or 'false' which type is string`);
            }
            value = newValue;
        };

        Object.defineProperty(target, propertyKey, {
            get: getter,
            set: setter,
            enumerable: true,
            configurable: true,
        });
    };
}
