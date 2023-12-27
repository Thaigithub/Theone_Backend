import { Expose } from 'class-transformer';
import { IsArray, IsNumber } from 'class-validator';
import { SalaryHistory } from '../dto/labor-company-salary.dto';
import { WorkDate } from '../dto/labor-company-workdate.dto';

export class LaborCompanyCreateRequest {
    @Expose()
    @IsNumber()
    public contractId: number;

    @Expose()
    @IsArray()
    public workDate: WorkDate[];

    @Expose()
    @IsNumber()
    public numberOfHours: number;

    @Expose()
    @IsArray()
    public salaryHistory: SalaryHistory[];
}
