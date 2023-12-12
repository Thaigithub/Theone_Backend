import { ApiProperty } from '@nestjs/swagger';
import { Account, Company, CompanyType } from '@prisma/client';
import { PaginationResponse } from 'utils/generics/pageInfo.response';

export class CompanyResponse {
    @ApiProperty({ type: 'string' })
    name: Company['name'];
    @ApiProperty({ type: 'string' })
    username: Account['username'];
    @ApiProperty({ type: 'enum', enum: CompanyType })
    type: Company['type'];
    @ApiProperty({ type: 'string' })
    contactName: Company['contactName'];
    @ApiProperty({ type: 'string' })
    contactPhone: Company['contactPhone'];
}

export class AdminCompanyGetListResponse extends PaginationResponse<CompanyResponse> {}
