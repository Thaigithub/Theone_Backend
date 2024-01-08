import { Post, SalaryType, Site } from '@prisma/client';
import { ApplicationCompanyApplicantsPostCodeDTO } from './application-company-applicants-post-code.dto';

export class ApplicationCompanyApplicantsPostDTO {
    siteContact: Site['personInChargeContact'];
    salaryAmount: Post['salaryAmount'];
    salaryType: SalaryType;
    siteAddress: Site['address'];
    occupation: ApplicationCompanyApplicantsPostCodeDTO;
    specialNote: ApplicationCompanyApplicantsPostCodeDTO;
}
