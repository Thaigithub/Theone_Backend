import { Expose } from 'class-transformer';
import { ParseBoolean } from 'utils/custom-decorators';

export class ContractCompanyGetSettlementDetailRequest {
    @Expose()
    @ParseBoolean()
    isTeam: boolean;
}
