import { ApiProperty } from '@nestjs/swagger';
import { Account, Company } from '@prisma/client';

export class AdminCompanyGetDetailsResponse {
    @ApiProperty()
    name: Company['name'];

    @ApiProperty()
    account: {
        username: Account['username'];
        status: Account['status'];
    };

    @ApiProperty()
    address: Company['address'];
    @ApiProperty()
    businessRegNumber: Company['businessRegNumber'];
    @ApiProperty()
    corporateRegNumber: Company['corporateRegNumber'];
    @ApiProperty()
    type: Company['type'];
    @ApiProperty()
    email: Company['email'];
    @ApiProperty()
    phone: Company['phone'];
    @ApiProperty()
    presentativeName: Company['presentativeName'];
    @ApiProperty()
    contactName: Company['contactName'];
    @ApiProperty()
    contactPhone: Company['contactPhone'];
}
