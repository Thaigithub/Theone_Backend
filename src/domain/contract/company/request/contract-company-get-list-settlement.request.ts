import { Expose } from 'class-transformer';
import { IsEnum, IsOptional, IsString, Matches } from 'class-validator';
import { PaginationRequest } from 'utils/generics/pagination.request';
import { ContractCompanySettlementStatus } from '../enum/contract-company-settlement-status.enum';
import { ContractType } from '../enum/contract-company-type-contract.enum';

export class ContractCompanyGetListSettlementRequest extends PaginationRequest {
    @Expose()
    @IsEnum(ContractCompanySettlementStatus)
    @IsOptional()
    settlementStatus: ContractCompanySettlementStatus;

    @Expose()
    @IsString()
    @IsOptional()
    searchTerm: string;

    @Expose()
    @IsString()
    @IsOptional()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'Date must be in the format yyyy-mm-dd.',
    })
    startDate: string;

    @Expose()
    @IsString()
    @IsOptional()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'Date must be in the format yyyy-mm-dd.',
    })
    endDate: string;

    @Expose()
    @IsEnum(ContractType)
    object: ContractType;
}
