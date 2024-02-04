import { BadRequestException } from '@nestjs/common';
import { Error } from './error.enum';

export function ParseBoolean(): PropertyDecorator {
    /* The custom decorator is use to transform string value to boolean value */
    return function (target: any, propertyKey: string) {
        let value: string = target[propertyKey];

        const getter = function () {
            return value === 'true';
        };

        const setter = function (newValue: string) {
            if (newValue != 'true' && newValue !== 'false') {
                throw new BadRequestException(Error.REQUEST_NOT_APPROPRIATE);
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
