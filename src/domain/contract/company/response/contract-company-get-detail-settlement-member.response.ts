import { ContractCompanyMember } from '../dto/contract-company-member.dto';
import { ContractCompanySite } from '../dto/contract-company-site.dto';
import { ContractCompanyWage } from '../dto/contract-company-wage.dto';
import { ContractCompanyWorkLoad } from '../dto/contract-company-workload.dto';

export class ContractCompanyGetDetailSettlementMemberResponse {
    siteInfor: ContractCompanySite;
    wageInfor: ContractCompanyWage;
    workLoadInfor: ContractCompanyWorkLoad;
    memberInfor: ContractCompanyMember;
}
