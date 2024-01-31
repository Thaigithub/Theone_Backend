import { Expose } from 'class-transformer';
import { IsEnum, IsOptional, IsString, Matches } from 'class-validator';
import { PaginationRequest } from 'utils/generics/pagination.request';
import { ContractMemberGetListStatus } from '../enum/contract-member-get-list-status.enum';

export class ContractMemberGetListRequest extends PaginationRequest {
    @Expose()
    @IsString()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'Date must be in the format yyyy-mm-dd.',
    })
    @IsOptional()
    startDate: Date;

    @Expose()
    @IsString()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'Date must be in the format yyyy-mm-dd.',
    })
    @IsOptional()
    endDate: Date;

    @Expose()
    @IsEnum(ContractMemberGetListStatus)
    @IsOptional()
    status: ContractMemberGetListStatus;
}
