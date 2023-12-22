import { ApiProperty } from '@nestjs/swagger';

export class ContractAdminGetTotalContractsResponse {
    @ApiProperty({ example: 100 })
    totalContracts: number;
}
