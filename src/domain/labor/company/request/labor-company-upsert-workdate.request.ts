import { Expose } from 'class-transformer';
import { IsArray } from 'class-validator';
import { LaborCompanyWorkDateDTO } from '../dto/labor-company-workdate.dto';

export class LaborCompanyUpsertWorkDateRequest {
    @Expose()
    @IsArray()
    workDate: LaborCompanyWorkDateDTO[];
}
