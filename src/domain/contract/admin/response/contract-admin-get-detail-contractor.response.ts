import { ApiProperty } from '@nestjs/swagger';
import { RequestObject } from '@prisma/client';
import { IsOptional } from 'class-validator';
import { ContractStatus } from 'utils/enum/contract-status.enum';

export class ContractAdminGetDetailContractorResponse {
    @ApiProperty({ example: RequestObject.INDIVIDUAL })
    object: RequestObject;

    @ApiProperty({ example: 'name' })
    name: string;

    @ApiProperty({ example: 'leader name' })
    @IsOptional()
    leaderName: string;

    @ApiProperty({ example: 'contact' })
    contact: string;

    @ApiProperty({ example: '2023-12-18T00:00:00.000Z' })
    contractStartDate: string;

    @ApiProperty({ example: '2023-12-18T00:00:00.000Z' })
    contractEndDate: string;

    @ApiProperty({ example: ContractStatus.CONTRACT_TERMINATED })
    contractStatus: ContractStatus;

    @ApiProperty({ example: 'key' })
    key: string;
}
