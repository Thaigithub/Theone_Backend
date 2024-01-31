import { Expose } from 'class-transformer';
import { IsEnum, IsOptional, Matches } from 'class-validator';
import { PaginationRequest } from 'utils/generics/pagination.request';
import { ContractMemberGetListStatus } from '../enum/contract-member-get-list-status.enum';

export class ContractMemberGetListForSalaryRequest extends PaginationRequest {
    @Expose()
    @IsOptional()
    @IsEnum(ContractMemberGetListStatus)
    status: ContractMemberGetListStatus;

    @IsOptional()
    @Expose()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'Date must be in the format yyyy-mm-dd.',
    })
    startDate: string;

    @IsOptional()
    @Expose()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'Date must be in the format yyyy-mm-dd.',
    })
    endDate: string;
}
