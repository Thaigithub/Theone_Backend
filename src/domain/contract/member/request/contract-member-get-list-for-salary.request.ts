import { PaginationRequest } from 'utils/generics/pagination.request';
import { ContractStatus } from '../enum/contract-member-status.enum';
import { Expose } from 'class-transformer';
import { IsEnum, IsOptional, Matches } from 'class-validator';

export class ContractMemberGetListForSalaryRequest extends PaginationRequest {
    @Expose()
    @IsOptional()
    @IsEnum(ContractStatus)
    status: ContractStatus;

    @IsOptional()
    @Expose()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'The property must be in the format yyyy-mm-dd.',
    })
    public startDate: string;

    @IsOptional()
    @Expose()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'The property must be in the format yyyy-mm-dd.',
    })
    public endDate: string;
}
