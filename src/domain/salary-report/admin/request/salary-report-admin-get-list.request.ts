import { Expose } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { SalaryReportCompanyGetListRequest } from 'domain/salary-report/company/request/salary-report-company-get-list.request';
import { SalaryReportAdminSearchCategory } from '../enum/salary-report-admin-search-category.enum';

export class SalaryReportAdminGetListRequest extends SalaryReportCompanyGetListRequest {
    @Expose()
    @IsOptional()
    @IsString()
    keyword: string;

    @Expose()
    @IsOptional()
    @IsEnum(SalaryReportAdminSearchCategory)
    category: SalaryReportAdminSearchCategory;
}
