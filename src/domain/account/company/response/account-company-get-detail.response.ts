import { Account, Company } from '@prisma/client';
import { FileResponse } from 'utils/generics/file.response';

export class AccountCompanyGetDetailResponse {
    id: Account['username'];
    email: Company['email'];
    contactName: Company['contactName'];
    phone: Company['phone'];
    contactPhone: Company['contactPhone'];
    name: Company['name'];
    estDate: Company['estDate'];
    presentativeName: Company['presentativeName'];
    address: Company['address'];
    type: Company['type'];
    businessRegNumber: Company['businessRegNumber'];
    corporateRegNumber: Company['corporateRegNumber'];
    attachments: FileResponse[];
    logo: FileResponse;
    contactCard: FileResponse;
}
