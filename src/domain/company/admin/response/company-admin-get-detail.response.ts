import { ApiProperty } from '@nestjs/swagger';
import { Account, Company, CompanyType } from '@prisma/client';
import { CompanyAdminGetDetailCompanySiteList } from '../dto/company-admin-get-detail-site-list.response.dto';

export class AdminCompanyGetDetailsResponse {
    @ApiProperty({ type: String })
    name: Company['name'];

    @ApiProperty()
    account: {
        username: Account['username'];
        status: Account['status'];
    };

    @ApiProperty({ type: String })
    address: Company['address'];
    @ApiProperty({ type: String })
    businessRegNumber: Company['businessRegNumber'];
    @ApiProperty({ type: String })
    corporateRegNumber: Company['corporateRegNumber'];
    @ApiProperty({ type: 'enum', enum: CompanyType })
    type: Company['type'];
    @ApiProperty({ type: String })
    email: Company['email'];
    @ApiProperty({ type: String })
    phone: Company['phone'];
    @ApiProperty({ type: String })
    presentativeName: Company['presentativeName'];
    @ApiProperty({ type: String })
    contactName: Company['contactName'];
    @ApiProperty({ type: String })
    contactPhone: Company['contactPhone'];
    @ApiProperty({ type: Array<CompanyAdminGetDetailCompanySiteList> })
    site: CompanyAdminGetDetailCompanySiteList[];
}
