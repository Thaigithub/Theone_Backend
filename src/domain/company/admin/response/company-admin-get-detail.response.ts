import { Account, Company } from '@prisma/client';

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
}
