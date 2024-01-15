import { Expose } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';
import { PaginationRequest } from 'utils/generics/pagination.request';
import { CodeAdminFilter } from '../dto/code-admin-filter.enum';

export class CodeAdminGetListRequest extends PaginationRequest {
    @Expose()
    @IsEnum(CodeAdminFilter)
    @IsOptional()
    codeType: CodeAdminFilter;
}
