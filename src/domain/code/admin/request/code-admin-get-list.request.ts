import { CodeType } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';
import { PaginationRequest } from 'utils/generics/pagination.request';

export class CodeAdminGetListRequest extends PaginationRequest {
    @Expose()
    @IsEnum(CodeType)
    @IsOptional()
    codeType: CodeType;
}
