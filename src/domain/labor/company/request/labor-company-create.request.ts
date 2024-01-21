import { Expose } from 'class-transformer';
import { IsArray, IsNumber } from 'class-validator';
import { LaborCompanySalaryDTO } from '../dto/labor-company-salary.dto';
import { LaborCompanyWorkDateDTO } from '../dto/labor-company-workdate.dto';

export class LaborCompanyCreateRequest {
    @Expose()
    @IsNumber()
    contractId: number;

    @Expose()
    @IsArray()
    workDate: LaborCompanyWorkDateDTO[];

    @Expose()
    @IsArray()
    salaryHistory: LaborCompanySalaryDTO[];
}
