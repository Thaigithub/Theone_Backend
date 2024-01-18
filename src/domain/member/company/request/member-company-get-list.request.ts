import { Expose } from 'class-transformer';
import { IsOptional, IsString, Matches } from 'class-validator';
import { PaginationRequest } from 'utils/generics/pagination.request';

export class MemberCompanyGetListRequest extends PaginationRequest {
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
    occupation: string[];

    @Expose()
    @IsString()
    @Matches(/^(([0-9]+-[0-9]+)|([0-9]+-[0-9]+,){1,4}([0-9]+-[0-9]+))$/, {
        message: 'The regionList must be in format x-x or x-x,x-x...(5 times)',
    })
    @IsOptional()
    regionList: string[];
}
