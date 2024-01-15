import { PaymentForm, SalaryType } from '@prisma/client';
import { FileResponse } from 'utils/generics/file.response';
import { ContractType } from '../enum/contract-company-type-contract.enum';

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
    file: FileResponse;
    department: string;
    paymentForm: PaymentForm;
}
