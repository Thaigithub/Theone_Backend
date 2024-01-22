import { Expose } from 'class-transformer';
import { ArrayMinSize, ArrayUnique, IsArray, IsNumber } from 'class-validator';

export class SalaryReportCompanyCreateRequest {
    @Expose()
    @IsArray()
    @ArrayUnique()
    @ArrayMinSize(1)
    @IsNumber({}, { each: true })
    siteIdList: number[];
}
