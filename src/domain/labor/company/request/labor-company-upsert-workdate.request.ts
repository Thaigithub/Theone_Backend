import { Expose } from 'class-transformer';
import { WorkDate } from '../dto/labor-company-workdate.dto';

export class LaborCompanyUpsertWorkDateRequest {
    @Expose()
    workDate: WorkDate[];
}
