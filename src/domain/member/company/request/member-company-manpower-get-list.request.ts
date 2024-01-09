import { Expose } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { PaginationRequest } from 'utils/generics/pagination.request';

export class MemberCompanyManpowerGetListRequest extends PaginationRequest {
    @Expose()
    @IsString()
    @IsOptional()
    keyword: string;

    @Expose()
    @IsString()
    @IsOptional()
    experienceTypeList: string[];

    @Expose()
    @IsString()
    @IsOptional()
    occupationList: string[];

    @Expose()
    @IsString()
    @IsOptional()
    districtList: string[];
}
