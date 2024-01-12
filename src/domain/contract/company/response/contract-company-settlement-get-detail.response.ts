class ContractCompanyGetSite {
    siteName: string;
    startDateConstruction: Date;
    endDateConstruction: Date;
    startDateContract: Date;
    endDateContract: Date;
    isWorking: boolean;
}

export class ContractCompanyGetMember {
    name: string;
    contact: string;
}

export class ContractCompanyGetTeam {
    leaderName: string;
    teamName: string;
    contact: string;
}

class ContractCompanyGetWage {
    wage: number;
    deductibleAmount: number;
    actualSalary: number;
}

class ContractCompanyGetWorkLoad {
    workDays: number;
    workLoad: number;
    laborId: number;
}

export class ContractCompanySettlementGetDetailResponse {
    siteInfor: ContractCompanyGetSite;
    wageInfor: ContractCompanyGetWage;
    workLoadInfor: ContractCompanyGetWorkLoad;
    memberInfor: ContractCompanyGetMember;
    teamInfor: ContractCompanyGetTeam;
}
