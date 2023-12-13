import { ApiProperty } from '@nestjs/swagger';
import { Account, Company, CompanyType } from '@prisma/client';
import { PaginationResponse } from 'utils/generics/pageInfo.response';

export class CompanyResponse {
    @ApiProperty({ type: Number })
    id: Company['id'];
    @ApiProperty({ type: String })
    name: Company['name'];
    @ApiProperty({ type: String })
    username: Account['username'];
    @ApiProperty({ type: 'enum', enum: CompanyType })
    type: Company['type'];
    @ApiProperty({ type: String })
    contactName: Company['contactName'];
    @ApiProperty({ type: String })
    contactPhone: Company['contactPhone'];
    @ApiProperty({ type: Date })
    regDate: Account['createdAt'];
}

export class AdminCompanyGetListResponse extends PaginationResponse<CompanyResponse> {}
