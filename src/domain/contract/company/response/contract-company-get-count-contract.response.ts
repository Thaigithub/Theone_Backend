import { ApiProperty } from '@nestjs/swagger';

export class ContractCompanyCountContractsResponse {
    @ApiProperty({ type: Number })
    countContracts: number;
}
