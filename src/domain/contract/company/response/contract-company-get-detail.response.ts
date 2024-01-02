import { SalaryType } from '@prisma/client';
import { FileClass } from '../dto/contract-company-filetype.dto';

export class ContractCompanyGetDetailResponse {
    companyName: string;
    siteName: string;
    postName: string;
    siteStartDate: Date;
    siteEndDate: Date;
    manager: string;
    phoneNumber: string;
    type: ContractType;
    name: string;
    contact: string;
    startDate: Date;
    endDate: Date;
    salaryType: SalaryType;
    amount: number;
    file: FileClass;
    department: string;
}
export enum ContractType {
    TEAM = 'TEAM',
    INDIVIDUAL = 'INDIVIDUAL',
}
