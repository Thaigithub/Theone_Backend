import { Expose } from 'class-transformer';
import { IsEnum, IsOptional, IsString, Matches } from 'class-validator';
import { PaginationRequest } from 'utils/generics/pagination.request';
import { ContractStatus } from '../enum/contract-member-status.enum';

export class ContractMemberGetListRequest extends PaginationRequest {
    @Expose()
    @IsString()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'The property must be in the format yyyy-mm-dd.',
    })
    @IsOptional()
    startDate: Date;

    @Expose()
    @IsString()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'The property must be in the format yyyy-mm-dd.',
    })
    @IsOptional()
    endDate: Date;

    @Expose()
    @IsEnum(ContractStatus)
    @IsOptional()
    status: ContractStatus;
}
