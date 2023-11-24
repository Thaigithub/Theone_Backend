import { CompanyType } from '@prisma/client';
import { Company } from 'domain/entities/company.entity';

export class CompanyDTO {
    id: number
    name: string
    address: string
    estDate: Date | string
    businessRegNumber: string
    corporateRegNumber: string
    type: CompanyType
    email: string
    phone: string
    presentativeName: string
    contactPhone: string
    contactName: string

    constructor(
        id: number,
        name: string,
        address: string,
        estDate: Date | string,
        businessRegNumber: string,
        corporateRegNumber: string,
        type: CompanyType,
        email: string,
        phone: string,
        presentativeName: string,
        contactPhone: string,
        contactName: string,
      ) {
        this.id= id
        this.name=name
        this.address=address
        this.estDate=estDate
        this.businessRegNumber=businessRegNumber
        this.corporateRegNumber=corporateRegNumber
        this.type=type
        this.email=email
        this.phone=phone
        this.presentativeName=presentativeName
        this.contactPhone=contactPhone
        this.contactName=contactName
      }
    
      static from(domain: Company): CompanyDTO {
        return new CompanyDTO(domain.id, domain.name, domain.address, domain.estDate, domain.businessRegNumber,domain.corporateRegNumber, domain.type, domain.email, domain.phone, domain.contactPhone, domain.contactName, domain.presentativeName);
      }
}
