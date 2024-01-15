import { Expose, Transform } from 'class-transformer';
import { IsNumber, IsOptional, Max } from 'class-validator';
import { MemberCompanyManpowerGetListRequest } from 'domain/member/company/request/member-company-manpower-get-list.request';

export class TeamCompanyManpowerGetListRequest extends MemberCompanyManpowerGetListRequest {
    @Expose()
    @IsNumber()
    @Max(1000)
    @IsOptional()
    @Transform(({ value }) => value && parseInt(value))
    numberOfMembers: number;
}
