import { Account, Company } from '@prisma/client';

export class CompanyDetailsResponse {
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
  constructor(data: CompanyDetailsResponse) {
    this.name = data.name;
    this.account = data.account;
    this.address = data.address;
    this.businessRegNumber = data.businessRegNumber;
    this.corporateRegNumber = data.corporateRegNumber;
    this.type = data.type;
    this.email = data.email;
    this.phone = data.phone;
    this.contactName = data.contactName;
    this.contactPhone = data.contactPhone;
    this.presentativeName = data.presentativeName;
  }
}

export class CompanyResponse {
  name: Company['name'];
  account: {
    username: Account['username'];
  };
  type: Company['type'];
  contactName: Company['contactName'];
  contactPhone: Company['contactPhone'];
}

export class CompanySearchResponse {
  companies: CompanyResponse[];
  constructor(companies: CompanyResponse[]) {
    this.companies = companies;
  }
}
