import { Contract, Site } from '@prisma/client';

export class SettlementCompanyGetDetail {
    siteInfor: {
        siteName: Site['name'];
        startDateConstruction: Site['startDate'];
        endDateConstruction: Site['endDate'];
        startDateContract: Contract['startDate'];
        endDateContract: Contract['endDate'];
        isWorking: boolean;
    };
    wageInfor: {
        wage: number;
        deductibleAmount: number;
        actualSalary: number;
    };
    workLoadInfor: {
        workDays: number;
        workLoad: number;
        laborId: number;
    };
    leaderName: string;
    teamName: string;
    name: string;
    contact: string;
}
