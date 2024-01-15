import { Contract, Member } from '@prisma/client';
import { PaginationResponse } from 'utils/generics/pagination.response';
import { ContractType } from '../enum/contract-company-type-contract.enum';

export class GetListForSite {
    type: ContractType;
    id: number;
    applicantId: number;
    name: string;
    teamLeaderName: Member['name'];
    contact: Member['contact'];
    startDate: Contract['startDate'];
    endDate: Contract['endDate'];
}
export class ContractCompanyGetListForSiteResponse extends PaginationResponse<GetListForSite> {}
