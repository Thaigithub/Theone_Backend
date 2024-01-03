import { Expose } from 'class-transformer';
import { IsArray } from 'class-validator';
import { WorkDate } from '../dto/labor-company-workdate.dto';

export class LaborCompanyUpsertWorkDateRequest {
    @Expose()
    @IsArray()
    workDate: WorkDate[];
}
