import { Expose } from 'class-transformer';
import { IsNumber } from 'class-validator';
import { ContractCompanyUpdateRequest } from './contract-company-update.request';

export class ContractCompanyCreateRequest extends ContractCompanyUpdateRequest {
    @IsNumber()
    @Expose()
    applicationId: number;
}
