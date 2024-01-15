import { Account, Company } from '@prisma/client';
import { CompanyAdminGetDetailCompanySiteList } from '../dto/company-admin-get-detail-site-list.response.dto';

export class AdminCompanyGetDetailsResponse {
    name: Company['name'];
    account: {
        username: Account['username'];
        status: Account['status'];
    };
    address: Company['address'];
    businessRegNumber: Company['businessRegNumber'];
    corporateRegNumber: Company['corporateRegNumber'];
    type: Company['type'];
    email: Company['email'];
    phone: Company['phone'];
    presentativeName: Company['presentativeName'];
    contactName: Company['contactName'];
    contactPhone: Company['contactPhone'];
    site: CompanyAdminGetDetailCompanySiteList[];
}
