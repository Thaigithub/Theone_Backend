import { Code } from '@prisma/client';

export class ApplicationCompanyApplicantsPostCodeDTO {
    code?: Code['code'];
    codeName: Code['codeName'];
}
