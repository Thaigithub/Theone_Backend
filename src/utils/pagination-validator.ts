import { BadRequestException } from '@nestjs/common';
import { Error } from './error.enum';

export class PaginationValidationService {
    static validate<T>(data: T[], pageNumber: number, pageSize: number): void {
        if (!Array.isArray(data)) {
            throw new BadRequestException(Error.REQUEST_NOT_APPROPRIATE);
        }
        const maxPageNumber = Math.ceil(data.length / pageSize);
        if (pageNumber < 1 || pageNumber > maxPageNumber) {
            throw new BadRequestException(Error.REQUEST_NOT_APPROPRIATE);
        }
        if (pageSize < 1) {
            throw new BadRequestException(Error.REQUEST_NOT_APPROPRIATE);
        }
    }
}
