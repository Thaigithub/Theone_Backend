import { Contract, Member, Site, Team, WorkDate } from '@prisma/client';
import { ContractAdminStatus } from '../enum/contract-admin-status.enum';

export class ContractAdminGetDetailSettlementResponse {
    siteName: Site['name'];
    siteStartDate: Site['startDate'];
    siteEndDate: Site['endDate'];
    contractStartDate: Contract['startDate'];
    contractEndDate: Contract['endDate'];
    contractstatus: ContractAdminStatus;
    workDate: {
        date: WorkDate['date'];
        hour: WorkDate['hours'];
    }[];
    numberOfWorkDate: number;
    numberOfWorkHour: number;
    wage: number;
    deductible: number;
    actual: number;
    member: {
        name: Member['name'];
        contact: Member['contact'];
    };
    team: {
        leaderName: Member['name'];
        name: Team['name'];
        contact: Member['contact'];
    };
}
