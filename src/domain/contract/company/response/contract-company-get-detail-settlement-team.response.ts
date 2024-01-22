import { ContractCompanySite } from '../dto/contract-company-site.dto';
import { ContractCompanyTeam } from '../dto/contract-company-team.dto';
import { ContractCompanyWage } from '../dto/contract-company-wage.dto';
import { ContractCompanyWorkLoad } from '../dto/contract-company-workload.dto';

export class ContractCompanyGetDetailSettlementTeamResponse {
    siteInfor: ContractCompanySite;
    wageInfor: ContractCompanyWage;
    workLoadInfor: ContractCompanyWorkLoad;
    teamInfor: ContractCompanyTeam;
}
