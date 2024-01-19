import { Code } from '@prisma/client';

export class FilterGetCodeResponse {
    id: Code['id'];

    codeName: Code['codeName'];
}
