import { Expose } from 'class-transformer';
import { IsArray, IsNumber } from 'class-validator';
import { WorkDate } from '../dto/labor-company-workdate.dto';

export class LaborCompanyUpdateRequest {
    @Expose()
    @IsArray()
    public workDate: WorkDate[];

    @Expose()
    @IsNumber()
    public numberOfHours: number;
}
