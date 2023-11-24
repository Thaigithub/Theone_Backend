import { CompanyDTO } from 'application/dtos/company.dto';

export class GetCompanyDetailsResponse {
    company: CompanyDTO;
    constructor(company: CompanyDTO){
        this.company = company;
    }
}