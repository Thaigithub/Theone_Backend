import { Code, Post, SalaryType, Site } from '@prisma/client';

export class ApplicationCompanyApplicantsPostDTO {
    siteContact: Site['personInChargeContact'];
    salaryAmount: Post['salaryAmount'];
    salaryType: SalaryType;
    siteAddress: Site['address'];
    occupation: {
        code: Code['code'];
        codeName: Code['codeName'];
    };
    specialNote: {
        code: Code['code'];
        codeName: Code['codeName'];
    };
}
