import { Expose } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Length, Matches } from 'class-validator';
import { PaginationRequest } from 'utils/generics/pagination.request';

export class SiteMemberGetListRequest extends PaginationRequest {
    @Expose()
    @IsOptional()
    @IsString()
    @Length(1, 50, { message: 'Site name should be maximum 50 characters' })
    keyword: string;

    @Expose()
    @IsString()
    @Matches(/^(([0-9]+-[0-9]+)|([0-9]+-[0-9]+,){1,4}([0-9]+-[0-9]+))$/, {
        message: 'The regionList must be in format 00-000 or 00-000,00-000...(5 times)',
    })
    @IsOptional()
    regionList: string[];

    @Expose()
    @IsNumber()
    @IsOptional()
    numberOfPost: number;
}
