import { ApiProperty } from '@nestjs/swagger';
import { ContractAdminGetDetailContractorResponse } from './contract-admin-get-detail-contractor.response';

export class ContractAdminGetDetailResponse {
    //Contract information
    @ApiProperty({ example: 'Site name' })
    siteName: string;

    @ApiProperty({ example: '2023-12-18T00:00:00.000Z' })
    startDate: string;

    @ApiProperty({ example: '2023-12-18T00:00:00.000Z' })
    endDate: string;

    @ApiProperty({ example: 'Manager' })
    manager: string;

    @ApiProperty({ example: 'Site contact' })
    siteContact: string;

    @ApiProperty({ example: 'Site email' })
    siteEmail: string;

    //Contractor
    @ApiProperty({ type: [ContractAdminGetDetailContractorResponse] })
    contractors: ContractAdminGetDetailContractorResponse[];
}
