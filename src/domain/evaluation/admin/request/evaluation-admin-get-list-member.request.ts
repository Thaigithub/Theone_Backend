import { Expose } from 'class-transformer';
import { IsBooleanString, IsOptional, IsString } from 'class-validator';
import { PaginationRequest } from 'utils/generics/pagination.request';

export class EvaluationAdminGetListMemberRequest extends PaginationRequest {
    @Expose()
    @IsBooleanString()
    @IsOptional()
    isHighestRating: string;

    @Expose()
    @IsString()
    @IsOptional()
    keyword: string;
}
