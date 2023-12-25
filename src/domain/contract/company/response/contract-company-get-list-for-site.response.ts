import { ApiProperty } from '@nestjs/swagger';
import { Contract, Member } from '@prisma/client';
import { PaginationResponse } from 'utils/generics/pageInfo.response';
import { ContractType } from '../enum/contract-company-type-contract.enum';

export class GetListForSite {
    @ApiProperty({ type: 'enum', enum: ContractType })
    type: ContractType;
    @ApiProperty({ type: Number })
    id: number;
    @ApiProperty({ type: Number })
    applicantId: number;
    @ApiProperty({ type: String })
    name: string;
    @ApiProperty({ type: String })
    teamLeaderName: Member['name'];
    @ApiProperty({ type: String })
    contact: Member['contact'];
    @ApiProperty({ type: Date })
    startDate: Contract['startDate'];
    @ApiProperty({ type: Date })
    endDate: Contract['endDate'];
}
export class ContractCompanyGetListForSiteResponse extends PaginationResponse<GetListForSite> {}
