import { Expose } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';
import { ContractAdminCountCategory } from '../enum/contract-admin-get-count-category.enum';

export class ContractAdminGetCountRequest {
    @Expose()
    @IsEnum(ContractAdminCountCategory)
    @IsOptional()
    category: ContractAdminCountCategory;
}
