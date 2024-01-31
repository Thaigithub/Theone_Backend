import { PaymentForm, RequestObject, SalaryType } from '@prisma/client';
import { FileResponse } from 'utils/generics/file.response';

export class ContractCompanyGetDetailResponse {
    companyName: string;
    siteName: string;
    postName: string;
    siteStartDate: Date;
    siteEndDate: Date;
    manager: string;
    phoneNumber: string;
    type: RequestObject;
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
